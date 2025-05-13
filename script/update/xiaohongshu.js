const { chromium } = require("playwright");
const { app } = require("electron");
const updateProfile = require("@utils/updateProfile/xiaohongshu");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindXiaohongshu = async () => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: `${userDataDir}/cache/storageState/xiaohongshu.json`,
  });

  const page = await context.newPage();

  await page.goto("https://creator.xiaohongshu.com/");

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse((res) =>
    res.url().includes("/galaxy/creator/home/personal_info")
  );

  // 更新 profileData
  await updateProfile(response);

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/xiaohongshu.json`,
  });

  await browser.close();
};

module.exports = bindXiaohongshu;
