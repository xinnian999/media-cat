const { chromium } = require("playwright");
const { dialog } = require("electron");
const path = require("path");
const createLogger = require("@/utils/createLogger");

module.exports = async (e, { url, filename = Date.now(), savePath }) => {
  const browser = await chromium.launch({
    headless: true,
  });

  global.addBrowser("downloadVideo", browser);

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();

  const logger = createLogger({
    page,
    sendFlag: "download-progress",
  });

  // 拦截所有谷歌广告相关请求
  await page.route("**/*googleads.g.doubleclick.net/**", (route) =>
    route.abort()
  );
  await page.route("**/*doubleclick.net/**", (route) => route.abort());
  await page.route("**/*googlesyndication.com/**", (route) => route.abort());

  await logger("开始提取", 0.2);

  try {
    await page.goto("https://tiktokio.com/zh/");
    await page.locator(".tiktok-url").fill(url);
    await page.click("#search-btn");

    await logger("解析视频链接", 0.4);

    const downloadBtn = await page.waitForSelector(
      'a:has-text("Download without watermark")',
      {
        timeout: 15000,
      }
    );

    await logger("解析成功，开始下载", 0.6);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      downloadBtn.click(),
    ]);

    const finalDownloadUrl = download.url();
    console.log("✅ 获取到真实下载链接:", finalDownloadUrl);

    await logger("正在下载", 0.7);

    if (savePath) {
      await download.saveAs(path.join(savePath, `${filename}.mp4`));
      await logger("下载完成", 1);
    } else {
      // 此处应该让用户去选择一个目录
      const result = await dialog.showSaveDialog({
        title: "保存文件",
        defaultPath: `${filename}.mp4`, // 默认文件名
        filters: [
          { name: "视频文件", extensions: ["mp4"] },
          { name: "所有文件", extensions: ["*"] },
        ],
        properties: ["createDirectory", "showOverwriteConfirmation"],
      });

      if (!result.canceled && result.filePath) {
        console.log("用户选择保存到:", result.filePath);
        await download.saveAs(result.filePath);
        await logger("下载完成", 1);
      } else {
        await logger("下载取消", 1);
      }
    }

    await page.waitForTimeout(1000);
  } catch (error) {
    await logger(`下载出错: ${error.message}`, 1);

    throw error;
  } finally {
    await global.removeBrowser("downloadVideo");
  }
};
