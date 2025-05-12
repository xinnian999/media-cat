const { chromium } = require("playwright");
const { app } = require("electron");
const writeJson = require("../../utils/writeJson");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindKuaishou = async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("https://creator.kuaishou.com/");

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse((res) =>
    res.url().includes("/rest/cp/creator/pc/home/userInfo")
  );

  const {
    data: { coreUserInfo: info },
  } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      kuaishou: {
        username: info.userName,
        avatar: info.headUrl,
        uid: info.userId,
        follower_count: info.fansNum,
      },
    };
  });

  console.log("✅ 用户信息已保存:");

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/kuaishou.json`,
  });

  await browser.close();
};

module.exports = bindKuaishou;
