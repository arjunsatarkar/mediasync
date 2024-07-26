"use strict";

(() => {
  const INTERVAL_MILLISECONDS = 3000;

  setInterval(() => {
    const stateElement = document.getElementsByClassName("state-element").item(0);
    if (stateElement !== null) {
      fetch(STATE_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: fetching state returned ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          const viewersConnected = json.viewersConnected;
          stateElement.dataset.text = `total viewers: ${viewersConnected}`;
        })
        .catch((_) => {
          stateElement.dataset.text = STATE_ELEMENT_INITIAL_TEXT;
        });
    }
  }, INTERVAL_MILLISECONDS);
})();