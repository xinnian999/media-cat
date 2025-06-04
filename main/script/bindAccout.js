const { chromium } = require("playwright");
const { app } = require("electron");

module.exports = async (e, platform) => {
  const browser = await chromium.launch({ headless: false });

  global.addBrowser("bindAccout", browser);

  const context = await browser.newContext();

  const page = await context.newPage();

  // 页面主动关闭时退出
  page.on("close", async () => {
    console.log("Page closed. Cleaning up...");
    await browser.close();
  });

  await page.goto("about:blank");

  const update = require(`@/script/updateProfile/${platform}`);

  await update(page);

  // 保存登录状态
  await context.storageState({
    path: `${app.getPath("userData")}/cache/storageState/${platform}.json`,
  });

  await global.removeBrowser("bindAccout");
};
