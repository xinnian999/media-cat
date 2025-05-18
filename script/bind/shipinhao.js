const { chromium } = require("playwright");
const { app } = require("electron");
const updateProfile = require("@utils/updateProfile/shipinhao");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bind = async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("https://channels.weixin.qq.com/");

  // 更新 profileData
  await updateProfile(page);

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/shipinhao.json`,
  });

  await browser.close();
};

module.exports = bind;
