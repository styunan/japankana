const { ipcRenderer } = require("electron");

function convert() {
  const jap_orgin = document.getElementById("jap_orgin");
  const jap_hiragana = document.getElementById("jap_hiragana");

  jap_hiragana.value = ipcRenderer.sendSync(
    "synchronous-message",
    jap_orgin.value
  );
}

global.convert = convert;
