const { chromium } = require("playwright");
const { app } = require("electron");

module.exports = async (e, { platform, url }) => {
  console.log(platform, url);
  const browser = await chromium.launch({ headless: false, channel: "chrome" });

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/${platform}.json`,
  });

  const page = await context.newPage();

  await page.goto(url);

  // 页面主动关闭时退出
  page.on("close", async () => {
    console.log("Page closed. Cleaning up...");
    await browser.close();
  });
};
