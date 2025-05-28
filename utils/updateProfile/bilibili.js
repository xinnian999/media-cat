const writeJson = require("@utils/writeJson");

module.exports = async (page) => {
  const infoDatas = [];

  page.on("response", async (response) => {
    if (response.url().includes("/web-interface/nav")) {
      const data = await response.json();
      infoDatas.push(data.data);
    }
  });

  await page.evaluate(() => {
    window.location.href =
      "https://member.bilibili.com/platform/home?spm_id_from=333.1007.0.0";
  });

  await page.waitForSelector("div:has-text('投稿')", { timeout: 0 });

  const info = infoDatas.find((item) => item.isLogin);

  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      bilibili: {
        nickname: info.uname,
        avatar: info.face,
        uid: info.mid,
        follower_count: 0,
        following_count: 0,
        total_favorited: 0,
      },
    };
  });

  console.log("✅ B站，profile已更新");
};
