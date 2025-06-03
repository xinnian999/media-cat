const path = require("path");

const moduleAlias = require("module-alias");

moduleAlias.addAlias("@", path.join(__dirname, "main"));

const { app, BrowserWindow, globalShortcut } = require("electron");

const onBeforeSendHeaders = require("@/onBeforeSendHeaders");

const invokes = require("@/invokes");


const startUi = require("@/utils/startUi");

const isDev = !app.isPackaged;

console.log("缓存位置：", app.getPath("userData"));

async function createWindow() {
  onBeforeSendHeaders();

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false, // 隐藏默认标题栏
    titleBarStyle: "hidden", // macOS 专用（Windows/Linux 不生效）
    trafficLightPosition: { x: 10, y: 10 }, // 控制 macOS 红黄绿按钮位置
    webPreferences: {
      preload: path.join(__dirname, "main/preload.js"),
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

  globalShortcut.register("F12", () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.webContents.openDevTools();
    }
  });

  Object.assign(global, {
    win,
    browsers: {},
    addBrowser: (name, browser) => {
      global.browsers[name] = browser;
    },
    removeBrowser: async (name) => {
      await global.browsers[name].close();
      delete global.browsers[name];
    },
  });

  invokes(win);
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
