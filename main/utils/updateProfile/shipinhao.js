const writeJson = require("@/utils/writeJson");

const url = "https://channels.weixin.qq.com";

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, url);

  // 等待请求用户信息，代表登录成功
  const res = await page.waitForResponse(
    (res) =>
      res.url().includes("/cgi-bin/mmfinderassistant-bin/auth/auth_data"),
    { timeout: 0 }
  );

  const {
    data: { finderUser: info },
  } = await res.json();

  // 更新 profileData
  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      shipinhao: {
        url,
        nickname: info.nickname,
        avatar: info.headImgUrl,
        uid: info.uniqId,
        follower_count: info.fansCount,
        // following_count: info.following_count,
        // total_favorited: info.total_favorited,
      },
    };
  });

  console.log("✅ 视频号，profile已更新");
};
