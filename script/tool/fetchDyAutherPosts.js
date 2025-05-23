const { chromium } = require("playwright");
const { app } = require("electron");
const path = require("path");
const writeJson = require("@utils/writeJson");
const { randomUUID } = require("crypto");
const dayjs = require("dayjs");

module.exports = async ({ url, addBrowser }) => {
  // const browser = await chromium.launch({ headless: false, devtools: true });
  const browser = await chromium.launch({ headless: true });

  addBrowser(browser);

  const context = await browser.newContext({
    storageState: path.join(
      app.getPath("userData"),
      "cache/storageState/douyin.json"
    ),
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

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

  for (let i = 0; i < 10; i++) {
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

  writeJson("cache/dyAutherPosts.json", (source) => {
    const newData = {
      ...profile,
      awemeList,
      id: randomUUID(),
      createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    if (source.list) {
      return { list: [newData, ...source.list] };
    }

    return { list: [newData] };
  });

  return awemeList;
};
