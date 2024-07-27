defmodule Mediasync.Router do
  import Mediasync.Constants
  import Mediasync.Utils
  import Mediasync.UserToken
  use Plug.Router
  use Plug.ErrorHandler

  plug(Plug.Logger, log: :debug)
  plug(Plug.Head)

  plug(Plug.Static, at: "/static", from: {:mediasync, "priv/static"})

  plug(:put_secret_key_base)

  plug(:session_wrapper)
  plug(:fetch_session)
  plug(:ensure_user_token)

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:urlencoded],
    pass: ["application/x-www-form-urlencoded"]
  )

  plug(Plug.CSRFProtection)

  plug(:dispatch)

  get "/" do
    enable_discord_activity? = Application.fetch_env!(:mediasync, :enable_discord_activity?)

    conn =
      conn
      |> put_html_content_type()

    cond do
      enable_discord_activity? and Map.has_key?(conn.query_params, query_param_instance_id()) ->
        conn
        |> put_session("discord_instance_id", conn.query_params["instance_id"])
        |> send_resp(200, Mediasync.Templates.discord_activity())

      enable_discord_activity? and
          Map.has_key?(conn.query_params, query_param_discord_activity_inner()) ->
        send_resp(conn, 200, Mediasync.Templates.home(:discord_activity))

      true ->
        send_resp(conn, 200, Mediasync.Templates.home())
    end
  end

  post "/host_room" do
    param_video_url = conn.body_params["video_url"]

    video_info = %Mediasync.Room.VideoInfo{
      url: param_video_url,
      content_type:
        hd(
          Req.Response.get_header(
            Req.head!(param_video_url, receive_timeout: 5000, retry: false),
            "content-type"
          )
        )
    }

    cond do
      byte_size(video_info.url) > Application.get_env(:mediasync, :max_video_url_size) ->
        Mediasync.HTTPErrors.send_video_url_too_large(conn)

      elem(URI.new(video_info.url), 0) != :ok ->
        Mediasync.HTTPErrors.send_invalid_video_url(conn)

      true ->
        in_discord_activity? =
          Application.fetch_env!(:mediasync, :enable_discord_activity?) and
            Map.has_key?(conn.query_params, query_param_discord_activity_inner())

        {suffix, host_username, instance_id} =
          if in_discord_activity? do
            {"?#{query_param_discord_activity_inner()}",
             Mediasync.DiscordAPI.get_user!(get_session(conn, "discord_access_token"))[
               "username"
             ], get_session(conn, "discord_instance_id")}
          else
            {"", nil, nil}
          end

        {:ok, _pid, room_id} =
          DynamicSupervisor.start_child(
            Mediasync.RoomSupervisor,
            {Mediasync.Room,
             %Mediasync.Room.State{
               video_info: video_info,
               host_user_token_hash: get_user_token_hash!(conn),
               host_username: host_username,
               discord_instance_id: instance_id
             }}
          )

        redirect(conn, status: 303, location: "/room/#{room_id}#{suffix}")
    end
  end

  get "/room/:room_id" do
    room_id = conn.path_params["room_id"]

    case Registry.lookup(Mediasync.RoomRegistry, room_id) do
      [{pid, _value}] ->
        video_info = Mediasync.Room.get_video_info(pid)

        {video_info, websocket_path, state_url, home_url} =
          if Application.fetch_env!(:mediasync, :enable_discord_activity?) and
               Map.has_key?(conn.query_params, query_param_discord_activity_inner()) do
            {%{video_info | url: "/.proxy/room/#{room_id}/video"},
             "/.proxy/room/#{room_id}/websocket?#{query_param_discord_activity_inner()}",
             "/.proxy/room/#{room_id}/state.json?#{query_param_discord_activity_inner()}",
             "/.proxy/?#{query_param_discord_activity_inner()}"}
          else
            {video_info, "/room/#{room_id}/websocket", "/room/#{room_id}/state.json", nil}
          end

        conn
        |> put_html_content_type()
        |> send_resp(
          200,
          Mediasync.Templates.room(video_info, websocket_path, state_url, home_url)
        )

      [] ->
        Mediasync.HTTPErrors.send_not_found(conn)
    end
  end

  get "/room/:room_id/websocket" do
    if MapSet.member?(
         Application.fetch_env!(:mediasync, :websocket_origin),
         hd(get_req_header(conn, "origin"))
       ) do
      user_token_hash = get_user_token_hash!(conn)
      room_id = conn.path_params["room_id"]

      case Registry.lookup(Mediasync.RoomRegistry, room_id) do
        [{pid, _value}] ->
          conn
          |> WebSockAdapter.upgrade(
            Mediasync.RoomConnection,
            %Mediasync.RoomConnection.State{
              room_pid: pid,
              room_id: room_id,
              user_token_hash: user_token_hash
            },
            max_frame_size: Application.fetch_env!(:mediasync, :websocket_max_frame_octets)
          )

        [] ->
          Mediasync.HTTPErrors.send_not_found(conn)
      end
    else
      Mediasync.HTTPErrors.send_forbidden(conn)
    end
  end

  get "/room/:room_id/state.json" do
    room_id = conn.path_params["room_id"]

    case Registry.lookup(Mediasync.RoomRegistry, room_id) do
      [{pid, _value}] ->
        conn
        |> put_json_content_type()
        |> send_resp(
          200,
          Jason.encode!(%{
            "hostConnected" => Mediasync.Room.host_connected?(pid),
            "viewersConnected" =>
              Registry.count_match(Mediasync.RoomSubscriptionRegistry, room_id, nil)
          })
        )

      [] ->
        Mediasync.HTTPErrors.send_not_found(conn)
    end
  end

  get "/room/:room_id/video" do
    room_id = conn.path_params["room_id"]

    case Registry.lookup(Mediasync.RoomRegistry, room_id) do
      [{pid, _value}] ->
        redirect(conn, status: 301, location: Mediasync.Room.get_video_info(pid).url)

      [] ->
        Mediasync.HTTPErrors.send_not_found(conn)
    end
  end

  post "/discord_activity/access_token" do
    if Application.fetch_env!(:mediasync, :enable_discord_activity?) do
      if Map.has_key?(conn.query_params, query_param_discord_activity_inner()) do
        response =
          Req.post!("https://discord.com/api/oauth2/token",
            headers: [
              content_type: "application/x-www-form-urlencoded"
            ],
            form: [
              client_id: Application.fetch_env!(:mediasync, :discord_client_id),
              client_secret: Application.fetch_env!(:mediasync, :discord_client_secret),
              grant_type: "authorization_code",
              code: conn.body_params["code"]
            ]
          )

        access_token = response.body["access_token"]

        conn
        |> put_session("discord_access_token", access_token)
        |> put_plain_text_content_type()
        |> send_resp(200, access_token)
      else
        # If the query param isn't present, we won't be able to modify the session (see session_wrapper/2).
        Mediasync.HTTPErrors.send_bad_request(conn,
          message:
            "This route must always be called with the query param ?#{query_param_discord_activity_inner()}"
        )
      end
    else
      Mediasync.HTTPErrors.send_not_found(conn)
    end
  end

  get "/discord_activity/rooms_for_instance" do
    if Application.fetch_env!(:mediasync, :enable_discord_activity?) do
      values =
        for {_pid, value} <-
              Registry.match(
                Mediasync.DiscordActivityInstanceRegistry,
                conn.query_params["instance_id"],
                :_
              ) do
          value
        end

      conn
      |> put_json_content_type()
      |> send_resp(200, Jason.encode!(values))
    else
      Mediasync.HTTPErrors.send_not_found(conn)
    end
  end

  match _ do
    Mediasync.HTTPErrors.send_not_found(conn)
  end

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: kind, reason: reason, stack: _stack}) do
    case {kind, reason} do
      {:error, %Plug.CSRFProtection.InvalidCSRFTokenError{}} ->
        Mediasync.HTTPErrors.send_invalid_csrf_token(conn)

      _ ->
        Mediasync.HTTPErrors.send_unknown(conn)
    end
  end

  defp session_wrapper(conn, _opts) do
    query_params = fetch_query_params(conn).query_params

    in_discord_activity? =
      Application.fetch_env!(:mediasync, :enable_discord_activity?) and
        (Map.has_key?(query_params, query_param_discord_activity_inner()) or
           (conn.request_path == "/" and
              Map.has_key?(query_params, query_param_instance_id())))

    Plug.Session.call(
      conn,
      Plug.Session.init(
        store: :cookie,
        key: "_mediasync_session",
        encryption_salt: {Mediasync.Utils, :get_session_encryption_salt, []},
        signing_salt: {Mediasync.Utils, :get_session_signing_salt, []},
        extra:
          if in_discord_activity? do
            "Domain=#{Application.fetch_env!(:mediasync, :discord_client_id)}.discordsays.com; SameSite=None; Partitioned; Secure;"
          else
            ""
          end
      )
    )
  end
end
