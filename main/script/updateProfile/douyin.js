const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.douyin;

// timeout 校验登录状态的等待时间。登录调用时传 0（无限等待），不传则默认 10s
module.exports = async (page, timeout = 30000) => {
  await page.goto(platform.url);

  // 等待登录成功
  await page.waitForSelector(
    ':is(button:has-text("发布视频"), button:has-text("高清发布"))',
    {
      timeout,
    }
  );

  const info = await page.evaluate(async () => {
    const res = await fetch("/web/api/media/user/info/");
    const data = await res.json();
    return data?.user;
  });

  // console.log("info", info);

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
