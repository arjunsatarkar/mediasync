defmodule Mediasync.RoomID do
  @type t() :: binary()

  @spec generate() :: t()
  def generate do
    Application.get_env(:mediasync, :node_id) <>
      "~" <> Base.url_encode64(:crypto.strong_rand_bytes(16), padding: false)
  end
end
