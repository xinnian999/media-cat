const { chromium } = require("playwright");
const { app } = require("electron");
const fs = require("fs");
const writeJson = require("@/utils/writeJson");
const { randomUUID } = require("crypto");
const dayjs = require("dayjs");

module.exports = async ({ autherUrl, addBrowser }) => {
  // const browser = await chromium.launch({ headless: false, devtools: true });
  const browser = await chromium.launch({ headless: true });

  addBrowser(browser);

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(autherUrl, { waitUntil: "domcontentloaded" });

  const response = await page.waitForResponse(
    (res) => res.url().includes("/user/profile"),
    { timeout: 10000 }
  );

  const { user } = await response.json();

  //   console.log(user);

  const savePath = `${app.getPath("downloads")}/dyAuthers/${user.nickname}`;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }

  const profile = {
    autherUrl,
    nickname: user.nickname,
    avatar: user.avatar_medium.url_list[0],
    aweme_count: user.aweme_count,
    follower_count: user.max_follower_count,
    total_favorited: user.total_favorited,
    id: randomUUID(),
    createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    savePath,
  };

  writeJson("cache/dyAuthers.json", (source) => {
    if (source.list) {
      return { list: [profile, ...source.list] };
    }

    return { list: [profile] };
  });

  //   return newData;
};
