const { chromium } = require("playwright");
const path = require("path");

module.exports = async ({ url, savePath, send, addBrowser }) => {
  const browser = await chromium.launch({
    headless: true,
  });

  addBrowser(browser);

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();

  await send({
    msg: "开始提取",
    percent: 0.2,
    page,
  });

  await page.goto("https://tiktokio.com/zh/");
  await page.locator(".tiktok-url").fill(url);
  await page.click("#search-btn");

  await send({
    msg: "解析视频链接",
    percent: 0.4,
    page,
  });

  const downloadBtn = await page.waitForSelector(
    'a:has-text("Download without watermark")',
    {
      timeout: 0,
    }
  );

  await send({
    msg: "解析成功，开始下载",
    percent: 0.6,
    page,
  });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    downloadBtn.click(),
  ]);

  const finalDownloadUrl = download.url();
  console.log("✅ 获取到真实下载链接:", finalDownloadUrl);

  await send({
    msg: "正在下载",
    percent: 0.7,
    page,
  });

  const outputPath = path.join(savePath, `${Date.now()}.mp4`);
  await download.saveAs(outputPath); // ✅ 直接保存到目标目录

  await send({
    msg: "下载完成",
    percent: 1,
    page,
  });

  console.log("✅ 下载完成:", outputPath);

  await page.waitForTimeout(1000);

  await browser.close();
};
