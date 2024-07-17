defmodule Mediasync.PlaybackState do
  @enforce_keys [:paused?, :position_milliseconds]
  defstruct @enforce_keys

  @type t() :: %Mediasync.PlaybackState{
          paused?: boolean(),
          position_milliseconds: integer()
        }
end
