import Config

default_port = 8000

enable_discord_activity? =
  Mediasync.Utils.int_repr_to_bool(
    String.to_integer(System.get_env("MEDIASYNC_ENABLE_DISCORD_ACTIVITY", "0"))
  )

websocket_origin =
  MapSet.new(
    String.split(
      System.get_env(
        "MEDIASYNC_WEBSOCKET_ORIGIN",
        "http://localhost:#{default_port} http://127.0.0.1:#{default_port}"
      )
    )
  )

{discord_client_id, discord_client_secret} =
  if enable_discord_activity? do
    {System.fetch_env!("MEDIASYNC_DISCORD_CLIENT_ID"),
     System.fetch_env!("MEDIASYNC_DISCORD_CLIENT_SECRET")}
  end

websocket_origin =
  if enable_discord_activity? do
    MapSet.put(websocket_origin, "https://#{discord_client_id}.discordsays.com")
  else
    websocket_origin
  end

config :mediasync,
  port: String.to_integer(System.get_env("MEDIASYNC_PORT", "#{default_port}")),
  websocket_origin: websocket_origin,
  max_rooms: :infinity,
  max_video_url_size: 2048,
  websocket_max_frame_octets: 10_000,
  enable_discord_activity?: enable_discord_activity?,
  discord_client_id: discord_client_id,
  discord_client_secret: discord_client_secret,
  secret_key_base: System.fetch_env!("MEDIASYNC_SECRET_KEY_BASE"),
  session_encryption_salt: System.fetch_env!("MEDIASYNC_SESSION_ENCRYPTION_SALT"),
  session_signing_salt: System.fetch_env!("MEDIASYNC_SESSION_SIGNING_SALT")
