// 创建一个日志记录器，返回一个记录函数
// 记录函数会记录日志到页面上，并发送给渲染进程

module.exports = ({
  page,
  speed = 2000,
  sendFlag = "global",
  sendExtra = {},
}) => {
  return async (msg, percent) => {
    global.win.webContents.send(sendFlag, {
      msg,
      percent,
      ...sendExtra,
    });

    console.log("\x1b[32m%s\x1b[0m", msg);

    await page.evaluate((msg) => {
      const id = "__my_logger__";

      let box = document.getElementById(id);

      if (!box) {
        box = document.createElement("div");
        box.id = id;
        box.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            background: rgba(0,0,0,0.8);
            color: #0f0;
            padding: 10px;
            font-size: 14px;
            font-family: monospace;
            max-width: 300px;
            white-space: pre-wrap;
            display: flex;
            flex-direction: column;
            gap: 20px;
          `;
        document.body.appendChild(box);
      }

      const line = document.createElement("div");
      line.textContent = msg;
      box.appendChild(line);
    }, msg);

    await page.waitForTimeout(speed);
  };
};
