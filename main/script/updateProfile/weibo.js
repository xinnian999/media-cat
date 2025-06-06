const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.weibo;

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, platform.url);

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse(
    (res) => res.url().includes("/multimedia/publish_display_config"),
    { timeout: 60000 }
  );

  const {
    data: { user: info },
  } = await response.json();

  // console.log(info);

  // 更新 profileData
  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      weibo: {
        nickname: info.name,
        avatar: info.avatar_large,
        uid: info.idstr,
        follower_count: info.followers_count,
        following_count: info.friends_count,
        total_favorited: info.status_total_counter.total_cnt,
        total_play: 0,
      },
    };
  });

  console.log("✅ 微博，profile已更新");
};
