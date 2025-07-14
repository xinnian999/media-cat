const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.xiaohongshu;

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, platform.url);

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse(
    (res) => res.url().includes("/galaxy/creator/home/personal_info"),
    { timeout: 60000 }
  );

  const { data: info } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      xiaohongshu: {
        nickname: info.name,
        avatar: info.avatar,
        uid: info.userId,
        follower_count: info.fans_count,
        following_count: info.follow_count,
        total_favorited: info.faved_count,
        total_play: 0,
      },
    };
  });

  console.log("✅ 小红书，profile已更新");
};
