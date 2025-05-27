const { chromium } = require("playwright");
const getMergeStorageState = require("@utils/getMergeStorageState");
const readJson = require("@utils/readJson");

const updateProfile = async () => {
  const browser = await chromium.launch({ headless: true });

  global.addBrowser("updateProfile", browser);

  const context = await browser.newContext({
    storageState: getMergeStorageState(),
  });

  const profile = readJson("cache/profile.json");

  const updates = Object.keys(profile).map(async (key) => {
    const update = require(`@utils/updateProfile/${key}`);

    const page = await context.newPage();

    await page.goto("about:blank");

    await update(page);
  });

  await Promise.all(updates);

  await global.clearBrowser("updateProfile");
};

module.exports = updateProfile;
