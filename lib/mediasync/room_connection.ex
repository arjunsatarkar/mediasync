defmodule Mediasync.RoomConnection.State do
  @enforce_keys [:room_pid, :room_id, :user_token_hash]
  defstruct [
    :room_pid,
    :room_id,
    :user_token_hash,
    :room_monitor_ref,
    :host?,
    initialized?: false
  ]

  @type t() :: %Mediasync.RoomConnection.State{
          room_pid: pid(),
          room_id: Mediasync.RoomID.t(),
          user_token_hash: Mediasync.UserToken.hash(),
          room_monitor_ref: reference() | nil,
          host?: boolean() | nil,
          initialized?: boolean()
        }
end

defmodule Mediasync.RoomConnection do
  import Mediasync.Utils, only: [bool_to_int_repr: 1, int_repr_to_bool: 1]

  @behaviour WebSock

  @spec init(Mediasync.RoomConnection.State.t()) :: {:ok, Mediasync.RoomConnection.State.t()}
  @impl true
  def init(state = %Mediasync.RoomConnection.State{}) do
    state = %{state | room_monitor_ref: Process.monitor(state.room_pid)}

    case Registry.register(
           Mediasync.RoomConnectionRegistry,
           {state.room_id, state.user_token_hash},
           nil
         ) do
      {:ok, _pid} ->
        state = %{state | host?: Mediasync.Room.host?(state.room_pid, state.user_token_hash)}

        unless state.host? do
          Registry.register(Mediasync.RoomSubscriptionRegistry, state.room_id, nil)
        end

        {:ok, state}

      _ ->
        {:stop, {:error, :user_already_connected}, state}
    end
  end

  @impl true
  def handle_in(
        {"i", opcode: :binary},
        state = %Mediasync.RoomConnection.State{}
      ) do
    {:push,
     [
       {:binary, <<"i", bool_to_int_repr(state.host?)::8>>}
     ], %{state | initialized?: true}}
  end

  @impl true
  def handle_in(
        {<<"s", paused?::8, position_milliseconds::64>>, opcode: :binary},
        state = %Mediasync.RoomConnection.State{}
      ) do
    if state.host? do
      Mediasync.Room.publish_playback_state(state.room_pid, %Mediasync.PlaybackState{
        paused?: int_repr_to_bool(paused?),
        position_milliseconds: position_milliseconds
      })

      {:ok, state}
    else
      {:stop, {:error, :received_forbidden_state_update}, state}
    end
  end

  @impl true
  def handle_info(
        {:playback_state_update, playback_state = %Mediasync.PlaybackState{}},
        state = %Mediasync.RoomConnection.State{}
      ) do
    if state.initialized? do
      {:push,
       {:binary,
        <<"s", bool_to_int_repr(playback_state.paused?)::8,
          playback_state.position_milliseconds::64>>}, state}
    else
      {:ok, state}
    end
  end

  @impl true
  def handle_info(
        {:DOWN, ref, :process, _object, reason},
        state = %Mediasync.RoomConnection.State{}
      ) do
    room_monitor_ref = state.room_monitor_ref

    case {ref, reason} do
      {^room_monitor_ref, :shutdown} -> {:stop, :normal, state}
      {^room_monitor_ref, _} -> {:stop, {:error, :room_exited}, state}
      _ -> {:stop, {:error, :unexpected_down_message}, state}
    end
  end
end
