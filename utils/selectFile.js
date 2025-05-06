const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");

async function selectFile() {
  const tempFile = path.join(os.tmpdir(), "selected_file.txt");

  // 临时生成 Electron 脚本
  const tempScript = path.join(os.tmpdir(), "filePickerTemp.js");
  const scriptContent = `
    const { app, dialog } = require("electron");
    const fs = require("fs");

    app.whenReady().then(async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Videos", extensions: ["mp4", "mov", "avi"] }]
      });
      if (!canceled) fs.writeFileSync(${JSON.stringify(tempFile)}, filePaths[0]);
      app.quit();
    });
  `;
  fs.writeFileSync(tempScript, scriptContent, "utf-8");

  const electronPath = path.resolve("node_modules/.bin/electron");

  // Windows 下是 electron.cmd
  const isWindows = process.platform === "win32";
  const execTarget = isWindows ? `${electronPath}.cmd` : electronPath;

  await new Promise((resolve, reject) => {
    execFile(execTarget, [tempScript], (error) => {
      if (error) return reject(error);
      resolve();
    });
  });

  if (!fs.existsSync(tempFile)) {
    throw new Error("你没有选择任何文件");
  }

  const filePath = fs.readFileSync(tempFile, "utf-8").trim();

  // 清理临时文件
  fs.unlinkSync(tempFile);
  fs.unlinkSync(tempScript);

  return filePath;
}


module.exports = selectFile;