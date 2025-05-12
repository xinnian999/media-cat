const { chromium } = require("playwright");
const { app } = require("electron");
const writeJson = require("../../utils/writeJson");

const userDataDir = app.getPath("userData"); // 安全可写

// 绑定账户
const bindDouyin = async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("https://creator.douyin.com/");

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse((res) =>
    res.url().includes("/aweme/v1/creator/user/info/")
  );

  const { douyin_user_verify_info: info } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      douyin: {
        username: info.nick_name,
        avatar: info.avatar_url,
        uid: info.douyin_unique_id,
        follower_count: info.follower_count,
        following_count: info.following_count,
        total_favorited: info.total_favorited,
      },
    };
  });

  console.log("✅ 用户信息已保存:");

  // 保存浏览器状态
  await context.storageState({
    path: `${userDataDir}/cache/storageState/douyin.json`,
  });

  await browser.close();
};

module.exports = bindDouyin;
