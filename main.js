const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // 开启 Node.js 集成
      webSecurity: false, // 禁用 Web 安全策略，允许加载本地文件
    },
  });
  win.webContents.openDevTools();

  win.loadURL("http://localhost:5173"); // 假设是 Vue 项目的本地服务器地址
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openFile"],
    });

    return result.filePaths[0]; // 返回选择的文件路径
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
