const { chromium } = require("playwright");
const { app } = require("electron");
const updateProfile = require("@utils/updateProfile/shipinhao");

const userDataDir = app.getPath("userData"); // 安全可写

module.exports = async () => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: `${userDataDir}/cache/storageState/shipinhao.json`,
  });

  const page = await context.newPage();

  await page.goto("https://channels.weixin.qq.com/");

  // 更新 profileData
  await updateProfile(page);

  await browser.close();
};
