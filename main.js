const { app, BrowserWindow, ipcMain, screen } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const kuroshiro = new Kuroshiro();
kuroshiro.init(new KuromojiAnalyzer());

ipcMain.on("synchronous-message", async (event, arg) => {
  const result = await kuroshiro.convert(arg, { to: "hiragana" });
  event.returnValue = result;
});

if (require("electron-squirrel-startup")) return;
function createWindow() {
  const width = screen.getPrimaryDisplay().workAreaSize.width;
  let mainWindowState = windowStateKeeper({
    defaultWidth: 270,
    defaultHeight: 102,
  });
  const win = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    maxHeight: 108,
    maxWidth: width,
    autoHideMenuBar: true,
    zoomToPageWidth: false,
    icon: path.join(__dirname, "assets/icons/japankana.ico"),
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  mainWindowState.manage(win);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

