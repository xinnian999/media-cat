const writeJson = require("@utils/writeJson");

module.exports = async (response) => {
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
      },
    };
  });

  console.log("✅ 抖音，profile已更新");
};