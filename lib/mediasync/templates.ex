defmodule Mediasync.Templates do
  require EEx

  def home() do
    home(false)
  end

  def room(video_info, room_id) do
    room(video_info, room_id, false)
  end

  EEx.function_from_file(:def, :home, "priv/home.html.eex", [:in_discord_activity?])

  EEx.function_from_file(:def, :room, "priv/room.html.eex", [
    :video_info,
    :room_id,
    :in_discord_activity?
  ])

  EEx.function_from_file(:def, :discord_activity, "priv/discord_activity.html.eex")
end
