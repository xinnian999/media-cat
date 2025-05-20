const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const https = require("https");

module.exports = async (url, savePath) => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // macOS 可改为 "" 使用默认
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  let lastUrl = "";
  let lastSize = 0;
  let s = 0;
  let timer = null;

  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] || "";
    const contentLength = parseInt(response.headers()["content-length"] || "0");

    if (contentType.includes("video")) {
      console.log(contentLength);
      // console.log(url);

      s = 0;

      if (contentLength > lastSize) {
        lastUrl = url;
        lastSize = contentLength;
      }
    }
  });

  await page.goto(url, {
    waitUntil: "load",
  });

  // 轮询等待最高画质视频出现
  await new Promise((resolve) => {
    timer = setInterval(() => {
      if (s === 10) {
        clearInterval(timer);
        resolve();
        return;
      }
      s++;
      console.log(s);
    }, 1000);
  });

  const outputPath = path.join(savePath, `${Date.now()}.mp4`);

  const file = fs.createWriteStream(outputPath);

  const options = new URL(lastUrl);

  options.headers = {
    Referer: url,
  };

  https
    .get(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ 请求失败，状态码: ${res.statusCode}`);
        return;
      }

      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("✅ 下载完成:", outputPath);
      });
    })
    .on("error", (err) => {
      fs.unlink(outputPath, () => {});
      console.error("❌ 下载出错:", err.message);
    });

  await browser.close(); // 可选
};
