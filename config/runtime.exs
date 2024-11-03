import Config

default_port = 8000

websocket_origin =
  MapSet.new(
    String.split(
      System.get_env(
        "MEDIASYNC_WEBSOCKET_ORIGIN",
        "http://localhost:#{default_port} http://127.0.0.1:#{default_port}"
      )
    )
  )

config :mediasync,
  port: String.to_integer(System.get_env("MEDIASYNC_PORT", "#{default_port}")),
  websocket_origin: websocket_origin,
  max_rooms: :infinity,
  max_video_url_size: 2048,
  websocket_max_frame_octets: 10_000,
  secret_key_base: System.fetch_env!("MEDIASYNC_SECRET_KEY_BASE"),
  session_encryption_salt: System.fetch_env!("MEDIASYNC_SESSION_ENCRYPTION_SALT"),
  session_signing_salt: System.fetch_env!("MEDIASYNC_SESSION_SIGNING_SALT"),
  source_url: "https://github.com/arjunsatarkar/mediasync/",
  source_link_text: "[source code]"
