defmodule Mediasync.DiscordAPI do
  @base_url "https://discord.com/api/v10/"

  @spec get_user!(String.t()) :: map()
  def get_user!(access_token) do
    response =
      Req.get!(@base_url <> "users/@me", headers: [authorization: "Bearer #{access_token}"])

    if response.status == 200 do
      response.body
    else
      raise "Discord API responded with status code #{response.status}"
    end
  end
end
