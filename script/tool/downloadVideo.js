const { chromium } = require("playwright");
const path = require("path");
const log = require("@utils/log");

module.exports = async (e, { url, filename = Date.now(), savePath }) => {
  const browser = await chromium.launch({
    headless: true,
  });

  global.addBrowser("downloadVideo", browser);

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();

  const send = async (msg, percent) => {
    e.sender.send("download-progress", { msg, percent });
    await log(page, msg);
  };

  await send("开始提取", 0.2);

  try {
    await page.goto("https://tiktokio.com/zh/");
    await page.locator(".tiktok-url").fill(url);
    await page.click("#search-btn");

    await send("解析视频链接", 0.4);

    const downloadBtn = await page.waitForSelector(
      'a:has-text("Download without watermark")',
      {
        timeout: 15000,
      }
    );

    await send("解析成功，开始下载", 0.6);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      downloadBtn.click(),
    ]);

    const finalDownloadUrl = download.url();
    console.log("✅ 获取到真实下载链接:", finalDownloadUrl);

    await send("正在下载", 0.7);

    const outputPath = path.join(savePath, `${filename}.mp4`);

    await download.saveAs(outputPath); // ✅ 直接保存到目标目录

    await send("下载完成", 1);

    console.log("✅ 下载完成:", outputPath);

    await page.waitForTimeout(1000);
  } catch (error) {
    await send(`下载出错: ${error.message}`, 1);

    throw error;
  } finally {
    await global.clearBrowser("downloadVideo");
  }
};
