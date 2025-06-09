const { chromium } = require("playwright");
const getMergeStorageState = require("@/utils/getMergeStorageState");
const readJson = require("@/utils/readJson");
const writeJson = require("@/utils/writeJson");

module.exports = async () => {
  const browser = await chromium.launch({ headless: true });

  global.addBrowser("updateProfile", browser);

  const context = await browser.newContext({
    storageState: getMergeStorageState(),
  });

  const profile = readJson("cache/profile.json");

  const updates = Object.keys(profile).map(async (key) => {
    const update = require(`./${key}`);

    const page = await context.newPage();

    await page.goto("about:blank");

    try {
      await update(page);
    } catch (error) {
      console.log(error);
      writeJson("cache/profile.json", (source) => {
        console.log("清除登录状态", key);
        delete source[key];
        return source;
      });
    }
  });

  await Promise.all(updates);

  console.log("所有平台数据更新完成");

  await global.removeBrowser("updateProfile");
};
