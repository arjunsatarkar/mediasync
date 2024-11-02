defmodule Mediasync.Router do
  import Mediasync.Utils
  import Mediasync.UserToken
  use Plug.Router
  use Plug.ErrorHandler

  plug(Plug.Logger, log: :debug)
  plug(Plug.Head)

  plug(Plug.Static, at: "/static", from: {:mediasync, "priv/static"})

  plug(:put_secret_key_base)

  plug(Plug.Session,
    store: :cookie,
    key: "_mediasync_session",
    encryption_salt: {Mediasync.Utils, :get_session_encryption_salt, []},
    signing_salt: {Mediasync.Utils, :get_session_signing_salt, []}
  )

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
    conn
    |> put_html_content_type()
    |> send_resp(200, Mediasync.Templates.home())
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
        case DynamicSupervisor.start_child(
               Mediasync.RoomSupervisor,
               {Mediasync.Room,
                %Mediasync.Room.State{
                  video_info: video_info,
                  host_user_token_hash: get_user_token_hash!(conn)
                }}
             ) do
          {:ok, _pid, room_id} ->
            redirect(conn, status: 303, location: "/room/#{room_id}")
        end
    end
  end

  get "/room/:room_id" do
    room_id = conn.path_params["room_id"]

    case Registry.lookup(Mediasync.RoomRegistry, room_id) do
      [{pid, _value}] ->
        conn
        |> put_html_content_type()
        |> send_resp(
          200,
          Mediasync.Templates.room(
            Mediasync.Room.get_video_info(pid),
            room_id
          )
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
end
