const { chromium } = require("playwright");
const writeJson = require("@/utils/writeJson");
const { app } = require("electron");

module.exports = async ({ autherUrl, addBrowser }) => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });

  global.addBrowser("updateDyAuther", browser);

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/douyin.json`,
  });

  const page = await context.newPage();
  await page.goto(autherUrl, { waitUntil: "domcontentloaded" });

  const profile = {};

  const awemeList = [];

  const collectedAwemeIds = new Set();

  // 监听 /aweme/post 响应，去重收集数据
  page.on("response", async (response) => {
    if (response.url().includes("/aweme/post") && response.status() === 200) {
      try {
        const json = await response.json();
        if (Array.isArray(json.aweme_list)) {
          for (const item of json.aweme_list) {
            const id = item.aweme_id || item.awemeId;
            if (id && !collectedAwemeIds.has(id)) {
              awemeList.push(item);
              collectedAwemeIds.add(id);
            }
          }
          console.log(`已收集 ${awemeList.length} 个视频`);
        }
      } catch (e) {
        console.warn("解析失败:", e.message);
      }
    }

    if (response.url().includes("/user/profile")) {
      const json = await response.json();
      Object.assign(profile, json.user);
    }
  });

  // 等待初始加载
  await page.waitForTimeout(5000);

  // 自动滚动局部容器
  const scrollSelector = ".route-scroll-container"; // ✅ 根据实际页面调整

  const scrollCount = Math.ceil(profile.aweme_count / 18);

  for (let i = 0; i < scrollCount; i++) {
    const hasContainer = await page.$(scrollSelector);
    if (!hasContainer) {
      throw new Error(`找不到可滚动容器: ${scrollSelector}`);
    }

    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }, scrollSelector);

    await page.waitForTimeout(2500);
  }

  writeJson("cache/dyAuthers.json", (source) => {
    const list = source.list.map((item) => {
      if (item.autherUrl === autherUrl) {
        return {
          ...item,
          ...profile,
          awemeList,
        };
      }
      return item;
    });

    return { list };
  });

  await global.removeBrowser("updateDyAuther");
};
