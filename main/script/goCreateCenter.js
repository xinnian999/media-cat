const { chromium } = require("playwright");
const { app } = require("electron");
const platforms = require("@/platforms");

module.exports = async (e, { platform }) => {
  const browser = await chromium.launch({ headless: false, channel: "chrome" });

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/${platform}.json`,
  });

  const page = await context.newPage();

  const platformInfo = platforms.map[platform];

  await page.goto(platformInfo.url);

  // 页面主动关闭时退出
  page.on("close", async () => {
    console.log("Page closed. Cleaning up...");
    await browser.close();
  });
};
