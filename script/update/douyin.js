const { chromium } = require("playwright");
const { app } = require("electron");
const updateProfile = require("@utils/updateProfile/douyin");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindDouyin = async () => {
  const browser = await chromium.launch({ headless: true });  

  const context = await browser.newContext({
    storageState: `${userDataDir}/cache/storageState/douyin.json`,
  });

  const page = await context.newPage();

  await page.goto("about:blank");

  await page.evaluate(() => {
    window.location.href = "https://creator.douyin.com/";
  });

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse(
    (res) => res.url().includes("/aweme/v1/creator/user/info/"),
    { timeout: 0 }
  );

  // 更新 profileData
  await updateProfile(response);

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/douyin.json`,
  });

  await browser.close();
};

module.exports = bindDouyin;
