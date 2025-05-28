const { chromium } = require("playwright");
const { app } = require("electron");

module.exports = async (e, platform) => {
  const browser = await chromium.launch({ headless: false });

  global.addBrowser("bindAccout", browser);

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("about:blank");

  const update = require(`@utils/updateProfile/${platform}`);

  await update(page);

  await context.storageState({
    path: `${app.getPath("userData")}/cache/storageState/${platform}.json`,
  });

  await global.clearBrowser("bindAccout");
};
