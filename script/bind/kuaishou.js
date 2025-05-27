const { chromium } = require("playwright");
const { app } = require("electron");
const updateProfile = require("@utils/updateProfile/kuaishou");
const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindKuaishou = async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  const page = await context.newPage();

  // 更新 profileData
  await updateProfile(page);

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/kuaishou.json`,
  });

  await browser.close();
};

module.exports = bindKuaishou;
