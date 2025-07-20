const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.bilibili;

module.exports = async (page) => {
  let infoData = {};

  let statData = {};

  page.on("response", async (response) => {
    if (response.url().includes("/web-interface/nav")) {
      const data = await response.json();
      if (data.data.isLogin) {
        infoData = data.data;
      }
    }

    if (response.url().includes("/data/index/stat")) {
      const data = await response.json();
      statData = data.data;
    }
  });

  await page.evaluate((url) => {
    window.location.href = url;
  }, platform.url);

  await page.waitForSelector("div:has-text('投稿')", { timeout: 120000 });

  await page.waitForSelector("div:has-text('粉丝总数')", { timeout: 0 });

  await page.waitForTimeout(3000);

  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      bilibili: {
        nickname: infoData.uname,
        avatar: infoData.face,
        uid: infoData.mid,
        follower_count: statData.total_fans,
        following_count: 0,
        total_favorited: statData.total_like,
        total_play: statData.total_click,
      },
    };
  });

  console.log("✅ B站，profile已更新");
};
