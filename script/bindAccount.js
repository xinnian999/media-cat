const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const PROFILE_PATH = path.resolve(__dirname, "../profile.json");

// 动态读取 profile.json 文件
let profileData = {};
if (fs.existsSync(PROFILE_PATH)) {
  profileData = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8"));
}

// 配置平台映射
const platformMap = {
  douyin: {
    url: "https://creator.douyin.com/",
    nameEL: ".name-_lSSDc",
    avatarEL: ".img-PeynF_",
    publishBtnEL: "button:has-text('发布视频')",
  },
  kuaishou: {
    url: "https://creator.kuaishou.com/",
    nameEL: ".user-info-name",
    avatarEL: ".user-info-avatar img",
    publishBtnEL: 'div:has-text("发布作品")',
  },
};

// 绑定账户
const bindAccount = async (platform = "douyin") => {
  const { url, nameEL, avatarEL, publishBtnEL } = platformMap[platform];

  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto(url);

  // 等待按钮加载完成
  await page.waitForSelector(publishBtnEL, {
    timeout: 0, // 无限等待
  });

  // 保存浏览器状态
  await context.storageState({ path: "./status.json" });

  // 提取账户信息
  const userInfo = await page.evaluate(
    ({ nameEL, avatarEL }) => {
      const nameEl = document.querySelector(nameEL);
      const avatarEl = document.querySelector(avatarEL);
      return {
        username: nameEl?.innerText || null,
        avatar: avatarEl?.src || null,
      };
    },
    { nameEL, avatarEL }
  );

  // 更新 profileData
  profileData[platform] = userInfo;

  console.log("修改后的用户信息：", profileData); // 打印修改后的 profileData

  // 确保直接写入文件
  fs.writeFileSync(PROFILE_PATH, JSON.stringify(profileData, null, 2));

  console.log("✅ 用户信息已保存:", userInfo);

  await browser.close();
};

module.exports = bindAccount;
