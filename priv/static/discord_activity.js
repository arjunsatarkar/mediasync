import { DiscordSDK } from "/static/discord-embedded-app-sdk/Discord.js";

const discordSdk = new DiscordSDK(DISCORD_CLIENT_ID);

discordSdk
  .ready()
  .then(() => {
    console.log("Mediasync: Discord SDK ready.");
    return discordSdk.commands.authorize({
      client_id: DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
    });
  })
  .then((result) => {
    const { code } = result;
    console.log(code);
  });
