const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.douyin;

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, platform.url);

  const getInfo = async () => {
    const response = await page.waitForResponse(
      (res) => res.url().includes("/media/user/info/"),
      { timeout: 60000 }
    );

    const { user } = await response.json();

    if (user) {
      return user;
    } else {
      return await getInfo(page);
    }
  };

  const info = await getInfo(page);

  // 更新 profileData
  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      douyin: {
        nickname: info.nickname,
        avatar: info.avatar_medium.url_list[0],
        uid: info.uid,
        follower_count: info.follower_count,
        following_count: info.following_count,
        total_favorited: +info.total_favorited,
        total_play: 0,
      },
    };
  });

  console.log("✅ 抖音，profile已更新");
};
