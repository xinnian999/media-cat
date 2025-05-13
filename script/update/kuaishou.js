const { chromium } = require("playwright");
const { app } = require("electron");
const updateProfile = require("@utils/updateProfile/kuaishou");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindKuaishou = async () => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: `${userDataDir}/cache/storageState/kuaishou.json`,
  });

  const page = await context.newPage();

  await page.goto("https://creator.kuaishou.com/");

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse((res) =>
    res.url().includes("/rest/cp/creator/pc/home/userInfo")
  );

  // 更新 profileData
  await updateProfile(response);

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/kuaishou.json`,
  });

  await browser.close();
};

module.exports = bindKuaishou;
