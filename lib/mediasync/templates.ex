defmodule Mediasync.Templates do
  require EEx

  def home() do
    home(:normal)
  end

  EEx.function_from_file(:def, :home, "priv/home.html.eex", [:mode])

  EEx.function_from_file(:def, :room, "priv/room.html.eex", [
    :video_info,
    :websocket_path,
    :state_url,
    :home_url
  ])

  EEx.function_from_file(:def, :discord_activity, "priv/discord_activity.html.eex")
end
