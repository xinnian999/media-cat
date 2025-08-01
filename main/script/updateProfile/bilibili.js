const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.bilibili;

module.exports = async (page, timeout = 10000) => {
  await page.goto(platform.url);

  await page.waitForSelector("div:has-text('投稿')", { timeout });

  const info = await page.evaluate(async () => {
    const res = await fetch("https://api.bilibili.com/x/web-interface/nav", {
      credentials: "include",
    });
    const data = await res.json();
    return data.data;
  });

  const stat = await page.evaluate(async () => {
    const res = await fetch("/x/web/data/index/stat?tmid=NaN");
    const data = await res.json();
    return data.data;
  });

  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      bilibili: {
        nickname: info.uname,
        avatar: info.face,
        uid: info.mid,
        follower_count: stat.total_fans,
        following_count: 0,
        total_favorited: stat.total_like,
        total_play: stat.total_click,
      },
    };
  });

  console.log("✅ B站，profile已更新");
};
