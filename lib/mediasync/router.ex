defmodule Mediasync.Router do
  import Mediasync.Utils
  import Mediasync.UserToken
  use Plug.Router
  use Plug.ErrorHandler

  plug(Plug.Logger)
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
    video_url = conn.body_params["video_url"]

    cond do
      byte_size(video_url) > Application.get_env(:mediasync, :max_video_url_size) ->
        Mediasync.HTTPErrors.send_video_url_too_large(conn)

      elem(URI.new(video_url), 0) != :ok ->
        Mediasync.HTTPErrors.send_invalid_video_url(conn)

      true ->
        {:ok, _pid, room_id} =
          DynamicSupervisor.start_child(
            Mediasync.RoomSupervisor,
            {Mediasync.Room,
             %Mediasync.Room.State{
               video_url: video_url,
               host_user_token_hash: get_user_token_hash!(conn)
             }}
          )

        redirect(conn, status: 303, location: "/room/#{room_id}")
    end
  end

  get "/room/:room_id" do
    case Registry.lookup(Mediasync.RoomRegistry, conn.path_params["room_id"]) do
      [{pid, _value}] ->
        conn
        |> put_html_content_type()
        |> send_resp(200, Mediasync.Templates.room(Mediasync.Room.get_video_url(pid)))

      [] ->
        Mediasync.HTTPErrors.send_not_found(conn)
    end
  end

  get "/room/:room_id/websocket" do
    # TODO: verify origin before doing any of this

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
  end

  match _ do
    Mediasync.HTTPErrors.send_not_found(conn)
  end

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: kind, reason: reason, stack: _stack}) do
    IO.inspect({kind, reason})

    case {kind, reason} do
      {:error, %Plug.CSRFProtection.InvalidCSRFTokenError{}} ->
        Mediasync.HTTPErrors.send_invalid_csrf_token(conn)

      _ ->
        Mediasync.HTTPErrors.send_unknown(conn)
    end
  end
end
