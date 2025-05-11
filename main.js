const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  globalShortcut,
} = require("electron");

const readJson = require("./utils/readJson");

const path = require("path");

const startUi = require("./utils/startUi");

const bindAccount = require("./script/bindAccount");

const log = require("./utils/log");

let win;

const isDev = !app.isPackaged;

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 隐藏默认标题栏
    titleBarStyle: "hidden", // macOS 专用（Windows/Linux 不生效）
    trafficLightPosition: { x: 10, y: 10 }, // 控制 macOS 红黄绿按钮位置
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

  ipcMain.handle("play", async (e, data) => {
    const scripts = data.platforms.map(async (plat) => {
      const script = require(`./script/${plat}`);
      const params = {
        ...data,
        send: async ({ page, ...rest }) => {
          e.sender.send("upload-progress", {
            ...rest,
            platform: plat,
          });
          await log(page, rest.msg);
        },
      };

      return await script(params);
    });

    await Promise.all(scripts);
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
