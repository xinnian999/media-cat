const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  globalShortcut,
} = require("electron");

const readJson = require("./script/readJson");

const path = require("path");

const startUi = require("./utils/startUi");

const play = require("./index");

const bindAccount = require("./script/bindAccount");

let win;

const isDev = !app.isPackaged;

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600, 
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // 开启 Node.js 集成
      webSecurity: false, // 禁用 Web 安全策略，允许加载本地文件
    },
  });

  if (isDev) {
    await startUi();

    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "ui/dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openFile"],
    });

    return result.filePaths[0]; // 返回选择的文件路径
  });

  ipcMain.handle("play",async (e, data) => {
    await play(data);
  });

  ipcMain.handle("bindAccount", async (e, url) => {
    await bindAccount(url);
  });

  ipcMain.handle("profile", () => {
    return readJson("cache/profile.json");
  });

  globalShortcut.register("F12", () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.webContents.openDevTools();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
