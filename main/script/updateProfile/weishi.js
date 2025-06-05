const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.weishi;

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, platform.url);

  // await page.waitForTimeout(30000);

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse(
    (res) => res.url().includes("/media-api/getPersonalInfo"),
    { timeout: 30000 }
  );

  const { personDetail:info } = await response.json();

  console.log(info)

  // 更新 profileData
  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      weishi: {
        nickname: info.nickName,
        avatar: info.avatar,
        uid: info.personId,
        follower_count: info.fansNum,
        following_count: info.interestNum,
        total_favorited: info.receivePraiseNum,
        total_play: 0,
      },
    };
  });

  console.log("✅ 微视，profile已更新");
};
