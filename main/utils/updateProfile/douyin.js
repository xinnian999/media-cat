const writeJson = require("@/utils/writeJson");

module.exports = async (page) => {
  await page.evaluate(() => {
    window.location.href = "https://creator.douyin.com/";
  });

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse(
    (res) => res.url().includes("/aweme/v1/creator/user/info/"),
    { timeout: 0 }
  );

  const { douyin_user_verify_info: info } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      douyin: {
        nickname: info.nick_name,
        avatar: info.avatar_url,
        uid: info.douyin_unique_id,
        follower_count: info.follower_count,
        following_count: info.following_count,
        total_favorited: info.total_favorited,
        total_play: 0,
      },
    };
  });

  console.log("✅ 抖音，profile已更新");
};
