defmodule Mediasync.Templates do
  require EEx
  EEx.function_from_file(:def, :home, "priv/home.html.eex")
  EEx.function_from_file(:def, :room, "priv/room.html.eex", [:video_url])
end
