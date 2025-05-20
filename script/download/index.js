const { chromium } = require("playwright");
const path = require("path");
const downloadVideo = require("./downloadVideo");

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

  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] || "";
    const contentLength = parseInt(response.headers()["content-length"] || "0");

    if (contentType.includes("video")) {
      console.log(contentLength);
      // console.log(url);

      if (contentLength > lastSize) {
        lastUrl = url;
        lastSize = contentLength;
      }
    }
  });

  await page.goto(url, {
    waitUntil: "load",
  });

  // 播放器懒加载，需要等一会加载真实视频
  await page.waitForTimeout(15000);

  // 拿 cookies
  const cookiesArray = await context.cookies();
  const cookieHeader = cookiesArray
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const fileName = `${Date.now()}.mp4`;
  const outputPath = path.join(savePath, fileName);

  downloadVideo(lastUrl, outputPath, cookieHeader);

  await browser.close(); // 可选
};
