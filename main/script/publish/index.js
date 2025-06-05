const { chromium } = require("playwright");
const { app } = require("electron");
const createLogger = require("@/utils/createLogger");
const platforms = require("@/platforms");

module.exports = async (e, { platform, observe, ...data }) => {
  const browser = await chromium.launch({
    headless: !observe,
    channel: "chrome",
  });

  global.addBrowser(platform, browser);

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/${platform}.json`,
  });

  const page = await context.newPage();

  await page.goto(platforms.map[platform].url);

  const logger = createLogger({
    page,
    sendFlag: "upload-progress",
    sendExtra: {
      platform,
    },
  });

  try {
    const publish = require(`./${platform}`);

    await publish({ page, logger, ...data });
  } catch (error) {
    logger(error.message, 1, "danger");
  } finally {
    await global.removeBrowser(platform);
  }
};
