defmodule Mix.Tasks.Vendor do
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    {_, 0} = System.cmd("npm", ~w(install))
    File.cp_r!("node_modules/video.js/dist", "priv/static/video.js")
    File.cp_r!("node_modules/video.js/LICENSE", "priv/static/video.js/LICENSE")
    nil
  end
end
