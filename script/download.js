const { chromium } = require("playwright");
const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const https = require("https");

async function downloadVideo(url, outputPath, cookies) {
  const options = new URL(url);

  options.headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    Referer: "https://www.douyin.com/",
    Cookie: cookies,
  };

  const file = fs.createWriteStream(outputPath);

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
}

module.exports = async (url, savePath) => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // macOS 可改为 "" 使用默认
  });

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/douyin.json`,
  });

  const page = await context.newPage();

  // 拿 cookies
  const cookiesArray = await context.cookies();
  const cookieHeader = cookiesArray
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] || "";

    if (
      contentType.includes("video") ||
      url.endsWith(".m3u8") ||
      url.endsWith(".mp4") ||
      url.endsWith(".ts")
    ) {
      const fileName = `${Date.now()}.mp4`;
      const outputPath = path.join(savePath, fileName);
      downloadVideo(url, outputPath, cookieHeader);
    }
  });

  await page.goto(url, {
    waitUntil: "load",
  });

  // 播放器懒加载，需要等一会加载真实视频
  await page.waitForTimeout(15000);

  // await browser.close(); // 可选
};
