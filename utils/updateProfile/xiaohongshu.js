const writeJson = require("@utils/writeJson");

module.exports = async (response) => {
  const {
    data: info,
  } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      xiaohongshu: {
        username: info.name,
        avatar: info.avatar,
        uid: info.userId,
        follower_count: info.fans_count,
        following_count: info.follow_count,
        total_favorited: info.faved_count,
      },
    };
  });

  console.log("✅ 小红书，profile已更新");
};