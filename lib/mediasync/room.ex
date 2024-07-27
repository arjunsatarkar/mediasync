defmodule Mediasync.Room.VideoInfo do
  @enforce_keys [:url, :content_type]

  defstruct [:url, :content_type]

  @type t() :: %Mediasync.Room.VideoInfo{
          url: binary(),
          content_type: binary()
        }
end

defmodule Mediasync.Room.State do
  @enforce_keys [:video_info, :host_user_token_hash]

  @host_disconnected_tries_max 5 * 6

  defstruct [
    :video_info,
    :host_user_token_hash,
    :room_id,
    :host_username,
    :viewer_usernames,
    :discord_instance_id,
    host_disconnected_tries: @host_disconnected_tries_max
  ]

  def host_disconnected_tries_max do
    @host_disconnected_tries_max
  end

  @type t() :: %Mediasync.Room.State{
          video_info: Mediasync.Room.VideoInfo.t(),
          host_user_token_hash: Mediasync.UserToken.hash(),
          room_id: Mediasync.RoomID.t() | nil,
          host_username: String.t() | nil,
          viewer_usernames: [String.t()] | nil,
          discord_instance_id: String.t() | nil,
          host_disconnected_tries: integer()
        }
end

defmodule Mediasync.Room do
  use GenServer
  require Logger

  @spec start_link(Mediasync.Room.State.t()) :: tuple()
  def start_link(state = %Mediasync.Room.State{}) do
    state =
      case state.room_id do
        nil -> %{state | room_id: Mediasync.RoomID.generate()}
        _ -> state
      end

    Tuple.append(
      GenServer.start_link(__MODULE__, state,
        name: {:via, Registry, {Mediasync.RoomRegistry, state.room_id}}
      ),
      state.room_id
    )
  end

  @spec get_video_info(GenServer.server()) :: Mediasync.Room.VideoInfo.t()
  def get_video_info(pid) do
    GenServer.call(pid, :get_video_info)
  end

  @spec host?(GenServer.server(), Mediasync.UserToken.hash()) :: boolean()
  def host?(pid, user_token_hash) do
    GenServer.call(pid, {:host?, user_token_hash})
  end

  @spec host_connected?(GenServer.server()) :: boolean()
  def host_connected?(pid) do
    GenServer.call(pid, :host_connected?)
  end

  defp host_connected_inner(state = %Mediasync.Room.State{}) do
    case Registry.lookup(
           Mediasync.RoomConnectionRegistry,
           {state.room_id, state.host_user_token_hash}
         ) do
      [{_pid, _value}] ->
        true

      [] ->
        false
    end
  end

  @spec publish_playback_state(GenServer.server(), Mediasync.PlaybackState.t()) :: :ok
  def publish_playback_state(pid, playback_state = %Mediasync.PlaybackState{}) do
    GenServer.call(pid, {:publish_playback_state, playback_state})
  end

  @inactive_check_wait_milliseconds 10 * 1000

  @impl true
  @spec init(Mediasync.Room.State.t()) :: {:ok, Mediasync.Room.State.t()}
  def init(state = %Mediasync.Room.State{}) do
    if state.discord_instance_id do
      Registry.register(Mediasync.DiscordActivityInstanceRegistry, state.discord_instance_id, %{
        host_username: state.host_username,
        room_id: state.room_id
      })
    end

    Process.send_after(self(), :check_if_active, @inactive_check_wait_milliseconds)

    Logger.info("Created room #{state.room_id}")

    {:ok, state}
  end

  @impl true
  def handle_call(:get_video_info, _from, state = %Mediasync.Room.State{}) do
    {:reply, state.video_info, state}
  end

  @impl true
  def handle_call({:host?, user_token_hash}, _from, state = %Mediasync.Room.State{}) do
    host_user_token_hash = state.host_user_token_hash

    case user_token_hash do
      ^host_user_token_hash -> {:reply, true, state}
      _ -> {:reply, false, state}
    end
  end

  @impl true
  def handle_call(:host_connected?, _from, state = %Mediasync.Room.State{}) do
    {:reply, host_connected_inner(state), state}
  end

  @impl true
  def handle_call(
        {:publish_playback_state, playback_state = %Mediasync.PlaybackState{}},
        _from,
        state = %Mediasync.Room.State{}
      ) do
    Registry.dispatch(Mediasync.RoomSubscriptionRegistry, state.room_id, fn entries ->
      for {pid, _} <- entries, do: send(pid, {:playback_state_update, playback_state})
    end)

    {:reply, :ok, state}
  end

  @impl true
  def handle_info(:check_if_active, state) do
    state =
      if host_connected_inner(state) do
        %{state | host_disconnected_tries: Mediasync.Room.State.host_disconnected_tries_max()}
      else
        %{state | host_disconnected_tries: state.host_disconnected_tries - 1}
      end

    Process.send_after(self(), :check_if_active, @inactive_check_wait_milliseconds)

    if state.host_disconnected_tries <= 0 do
      Logger.info("Room #{state.room_id} shutting down: no host")
      {:stop, {:shutdown, :no_host}, state}
    else
      {:noreply, state}
    end
  end
end
