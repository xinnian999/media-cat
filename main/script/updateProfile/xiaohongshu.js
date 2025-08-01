const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.xiaohongshu;

module.exports = async (page, timeout = 30000) => {
  await page.goto(platform.url);

  // 等待登录成功
  await page.waitForSelector(".publish-video .btn", {
    timeout,
  });

  // 获取用户信息
  const info = await page.evaluate(async () => {
    const res = await fetch("/api/galaxy/creator/home/personal_info");
    const data = await res.json();
    return data.data;
  });

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
