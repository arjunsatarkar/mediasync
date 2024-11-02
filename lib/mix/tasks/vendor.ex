defmodule Mix.Tasks.Vendor do
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    {_, 0} = System.cmd("npm", ~w(install --include=dev))

    File.cp_r!("node_modules/video.js/dist", "priv/static/vendored/video.js")
    File.cp_r!("node_modules/video.js/LICENSE", "priv/static/vendored/video.js/LICENSE")

    nil
  end
end
