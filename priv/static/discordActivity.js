import { DiscordSDK } from "/static/discord-embedded-app-sdk/Discord.js";

const discordSdk = new DiscordSDK(DISCORD_CLIENT_ID);

const updateInstanceRoomInfo = () => {
  const contentEl = document.getElementById("instance-room-info-content");

  const defaultContents = document.createElement("i");
  defaultContents.innerText = "none yet";
  if (!contentEl.hasChildNodes()) {
    contentEl.replaceChildren(defaultContents);
  }

  fetch(roomsForInstanceUrl(discordSdk.instanceId))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Fetching instance room info failed with status code ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      let docFragment = new DocumentFragment();
      if (json.length === 0) {
        docFragment.appendChild(defaultContents);
      } else {
        const listEl = docFragment.appendChild(document.createElement("ul"));
        for (const roomInfo of json) {
          const item = listEl.appendChild(document.createElement("li"));
          item.innerText = roomInfo["host_username"] + " ";
          const form = item.appendChild(document.createElement("form"));
          form.action = roomUrl(roomInfo["room_id"]);
          form.target = "activity-inner-iframe";
          form.style.display = "inline";
          const hiddenInput = form.appendChild(document.createElement("input"));
          hiddenInput.type = "hidden";
          hiddenInput.name = QUERY_PARAM_DISCORD_ACTIVITY_INNER;
          const submitInput = form.appendChild(document.createElement("input"));
          submitInput.type = "submit";
          submitInput.value = "join";
        }
      }
      contentEl.replaceChildren(docFragment);
    })
    .catch((error) => {
      console.error(error);
    });
};

updateInstanceRoomInfo();
const INSTANCE_ROOM_INFO_INTERVAL = 3000;
let instanceRoomInfoIntervalId = setInterval(updateInstanceRoomInfo, INSTANCE_ROOM_INFO_INTERVAL);

const iframe = document.querySelector("iframe");
// It doesn't matter if the iframe's initial loading finishes before this is added
iframe.addEventListener("load", (_) => {
  clearInterval(instanceRoomInfoIntervalId);

  const locationURL = new URL(iframe.contentWindow.location);
  const locationPath = locationURL.pathname + locationURL.search;
  if (locationPath === HOME_URL) {
    updateInstanceRoomInfo();
    instanceRoomInfoIntervalId = setInterval(updateInstanceRoomInfo, INSTANCE_ROOM_INFO_INTERVAL);
    iframe.className = "at-home";
  } else {
    iframe.className = "";
  }
});

discordSdk
  .ready()
  .then(() => {
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

    return fetch(ACCESS_TOKEN_URL, {
      body: new URLSearchParams([["code", code]]),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-csrf-token": document.body.dataset.csrfToken,
      },
      method: "POST",
    });
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Getting access token failed with status code ${response.status}`);
    }
    // Note: the access token should now be in the session cookie as well
    return response.text();
  })
  .then((accessToken) => {
    return discordSdk.commands.authenticate({ access_token: accessToken });
  })
  .then((authenticationResult) => {
    if (authenticationResult === null) {
      throw new Error("Authenticating with Discord client failed");
    }
    iframe.style.display = null;
  })
  .catch((error) => {
    console.error(error);
    const CLOSE_ABNORMAL = 1006;
    discordSdk.close(CLOSE_ABNORMAL, "Could not obtain authorizations required to run this app.");
  });
