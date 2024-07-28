"use strict";

(() => {
  const randomBackoffMilliseconds = (lowest, highest) => {
    return Math.round(Math.random() * (highest - lowest) + lowest);
  };

  const prepareInitialInfoMessage = () => {
    const dataView = new DataView(new ArrayBuffer(1));
    dataView.setUint8(0, "i".charCodeAt(0));
    return dataView;
  };

  const prepareStateUpdateMessage = (positionMilliseconds, paused) => {
    const dataView = new DataView(new ArrayBuffer(10));
    dataView.setUint8(0, "s".charCodeAt(0));
    dataView.setUint8(1, +paused);
    dataView.setBigUint64(2, positionMilliseconds);
    return dataView;
  };

  const setControlsEnabled = (player, enabled) => {
    const controls = [player.controlBar.progressControl, player.controlBar.playToggle];
    for (const control of controls) {
      enabled ? control.enable() : control.disable();
    }
  };

  const player = videojs("player", {
    controls: true,
    experimentalSvgIcons: true,
    fill: true,
    playsinline: true,
    preload: "auto",
  });

  player.ready(() => {
    setControlsEnabled(player, false);

    {
      let customIconPosition = 1;
      const Button = videojs.getComponent("Button");
      if (HOME_BUTTON_URL !== null) {
        const homeButton = new Button(player, {
          clickHandler: (_) => {
            location = HOME_BUTTON_URL;
          },
        });
        homeButton.addClass("icon-home");
        homeButton.controlText("Return Home");
        player.controlBar.addChild(homeButton, {}, customIconPosition++);
      }

      const stateButton = new Button(player, {
        clickHandler: (event) => {
          const stateButtonEl = stateButton.el();
          const id = stateButtonEl.getAttribute("id");
          stateButtonEl.setAttribute("id", id ? "" : "state-button-active");
        },
      });
      stateButton.el().setAttribute("data-text", STATE_ELEMENT_INITIAL_TEXT);
      stateButton.addClass("icon-users state-element");
      stateButton.controlText("Viewers");
      player.controlBar.addChild(stateButton, {}, customIconPosition++);
    }

    const updatePlaybackState = (latestReceivedState, nowMilliseconds) => {
      if (nowMilliseconds - latestReceivedState.receivedAtMilliseconds > 2000) {
        player.pause();
        return;
      }

      const idealPositionMilliseconds =
        latestReceivedState.positionMilliseconds +
        (nowMilliseconds - latestReceivedState.receivedAtMilliseconds);
      const currentPositionMilliseconds = player.currentTime() * 1000;
      const positionDiffMilliseconds = currentPositionMilliseconds - idealPositionMilliseconds;
      const absPositionDiffMilliseconds = Math.abs(positionDiffMilliseconds);

      if (absPositionDiffMilliseconds > 1250) {
        player.currentTime(idealPositionMilliseconds / 1000);
        player.playbackRate(1);
      } else if (
        absPositionDiffMilliseconds > 200 ||
        (player.playbackRate() !== 1 && absPositionDiffMilliseconds > 100)
      ) {
        player.playbackRate(1 - 0.02 * Math.sign(positionDiffMilliseconds));
      } else {
        player.playbackRate(1);
      }

      if (latestReceivedState.paused) {
        player.pause();
      } else {
        player.play().then(null, () => {
          // Failed to play - try muting in case it's because the browser is blocking autoplay
          player.muted(true);
          player.play().then(null, () => console.error("Failed to play video."));
        });
      }
    };

    const latestReceivedState = {
      paused: true,
      positionMilliseconds: 0,
      receivedAtMilliseconds: null,
    };

    const manageWebsocket = () => {
      let websocket = new WebSocket(WEBSOCKET_URL);
      websocket.binaryType = "arraybuffer";

      let initialized = false;
      let host;

      // Interval to check video state for non-hosts, and to send state for host
      let intervalId;

      websocket.addEventListener("open", (_) => {
        console.debug("Created WebSocket connection successfully.");
        websocket.send(prepareInitialInfoMessage());
      });

      websocket.addEventListener("message", (event) => {
        const messageDataView = new DataView(event.data);
        switch (String.fromCharCode(messageDataView.getUint8(0))) {
          case "i":
            if (initialized) {
              websocket.close(); // Error condition: we're already initialized
            } else {
              initialized = true;
              host = !!messageDataView.getUint8(1);

              // How often host sends state - unused on non-host clients
              const SEND_STATE_INTERVAL_MILLISECONDS = 250;
              // How often client checks if its state matches what the server sent - unused on hosts
              const CHECK_STATE_INTERVAL_MILLISECONDS = 20;

              if (host) {
                setControlsEnabled(player, true);
                intervalId = setInterval(() => {
                  websocket.send(
                    prepareStateUpdateMessage(
                      BigInt(Math.round(player.currentTime() * 1000)),
                      player.paused(),
                    ),
                  );
                }, SEND_STATE_INTERVAL_MILLISECONDS);
              } else {
                intervalId = setInterval(() => {
                  updatePlaybackState(latestReceivedState, performance.now());
                }, CHECK_STATE_INTERVAL_MILLISECONDS);
              }
            }
            break;
          case "s":
            if (host || !initialized) {
              /* Error conditions: host should send state updates, not receive
                 them, and the server should not send us state updates until
                 we're initialized. */
              websocket.close();
            } else {
              latestReceivedState.paused = messageDataView.getUint8(1);
              latestReceivedState.positionMilliseconds = Number(messageDataView.getBigUint64(2));
              latestReceivedState.receivedAtMilliseconds = performance.now();
            }
            break;
          default:
            websocket.close(); // Error condition: unrecognized message type
        }
      });

      websocket.addEventListener("close", (_) => {
        clearInterval(intervalId);
        player.pause();
        const recreateAfter = randomBackoffMilliseconds(50, 3000);
        console.debug(
          `WebSocket connection closed; will attempt to recreate it in ${recreateAfter} ms.`,
        );
        websocket = null;
        setTimeout(manageWebsocket, recreateAfter);
      });
    };

    manageWebsocket();
  });
})();
