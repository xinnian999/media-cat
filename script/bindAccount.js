const { chromium } = require("playwright");
const readJson = require("../utils/readJson");
const writeJson = require("../utils/writeJson");

const profileData = readJson("cache/profile.json");

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

  // 等待登陆成功
  await page.waitForSelector(publishBtnEL, {
    timeout: 0, // 无限等待
  });

  // 保存浏览器状态
  await context.storageState({ path: `./cache/storageState/${platform}.json` });

  await page.waitForSelector(nameEL, {
    timeout: 0, // 等待用户名加载完成
  });

  await page.waitForSelector(avatarEL, {
    timeout: 0, // 等待头像加载完成
  });

  // 提取账户信息
  const username = await page.locator(nameEL).innerText();
  const avatar = await page.locator(avatarEL).getAttribute("src");

  const userInfo = {
    username,
    avatar,
  };

  // 更新 profileData
  writeJson("cache/profile.json", {
    ...profileData,
    [platform]: userInfo,
  });

  console.log("✅ 用户信息已保存:", userInfo);

  await browser.close();
};

module.exports = bindAccount;
