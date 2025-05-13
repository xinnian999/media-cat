const writeJson = require("@utils/writeJson");

module.exports = async (response) => {
  const {
    data: { coreUserInfo: info },
  } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      kuaishou: {
        username: info.userName,
        avatar: info.headUrl,
        uid: info.userId,
        follower_count: info.fansNum,
      },
    };
  });

  console.log("✅ 快手，profile已更新");
};