import Config

{:ok, sqids} = Sqids.new()

config :mediasync,
  port: String.to_integer(System.get_env("MEDIASYNC_PORT", "8000")),
  node_id: Sqids.encode!(sqids, [String.to_integer(System.get_env("MEDIASYNC_NODE_ID", "1"))]),
  max_rooms: :infinity,
  max_video_url_size: 2048,
  websocket_max_frame_octets: 10_000,
  secret_key_base: System.fetch_env!("MEDIASYNC_SECRET_KEY_BASE"),
  session_encryption_salt: System.fetch_env!("MEDIASYNC_SESSION_ENCRYPTION_SALT"),
  session_signing_salt: System.fetch_env!("MEDIASYNC_SESSION_SIGNING_SALT")
