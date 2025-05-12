const { chromium } = require("playwright");
const { app } = require("electron");
const writeJson = require("../../utils/writeJson");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindXiaohongshu = async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("https://creator.xiaohongshu.com/");

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse((res) =>
    res.url().includes("/galaxy/creator/home/personal_info")
  );

  const {
    data: info,
  } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      xiaohongshu: {
        username: info.name,
        avatar: info.avatar,
        uid: info.userId,
        follower_count: info.fans_count,
        following_count: info.follow_count,
        total_favorited: info.faved_count,
      },
    };
  });

  console.log("✅ 用户信息已保存:");

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/xiaohongshu.json`,
  });

  await browser.close();
};

module.exports = bindXiaohongshu;
