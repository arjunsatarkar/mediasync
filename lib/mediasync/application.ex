defmodule Mediasync.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Starts a worker by calling: Mediasync.Worker.start_link(arg)
      # {Mediasync.Worker, arg}
      {Bandit,
       plug: Mediasync.Router,
       scheme: :http,
       ip: {127, 0, 0, 1},
       port: Application.get_env(:mediasync, :port)},
      {DynamicSupervisor,
       max_children: Application.get_env(:mediasync, :max_rooms),
       max_restarts: 0,
       strategy: :one_for_one,
       name: Mediasync.RoomSupervisor},
      {Registry, keys: :unique, name: Mediasync.RoomRegistry},
      {Registry, keys: :unique, name: Mediasync.RoomConnectionRegistry},
      {Registry, keys: :duplicate, name: Mediasync.RoomSubscriptionRegistry}
    ]

    System.no_halt(true)

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Mediasync.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
