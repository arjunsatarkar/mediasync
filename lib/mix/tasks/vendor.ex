defmodule Mix.Tasks.Vendor do
  use Mix.Task

  @impl Mix.Task
  def run([]) do
    {_, 0} = System.cmd("npm", ~w(install --include=dev))

    File.cp_r!("node_modules/video.js/dist", "priv/static/video.js")
    File.cp_r!("node_modules/video.js/LICENSE", "priv/static/video.js/LICENSE")

    {_, 0} = System.cmd("npx", ~w(parcel build --target discord-embedded-app-sdk))

    discord_readme_path = "priv/static/discord-embedded-app-sdk/README.md"

    File.cp_r!(
      "node_modules/@discord/embedded-app-sdk/LICENSE.md",
      discord_readme_path
    )

    File.write!(
      discord_readme_path,
      """
      This directory contains a bundled version of https://github.com/discord/embedded-app-sdk/
      See lib/mix/tasks/vendor.ex for how it was generated. The license for the \
      original library is reproduced below:\n
      """ <> File.read!(discord_readme_path)
    )

    nil
  end
end
