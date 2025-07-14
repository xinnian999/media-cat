const writeJson = require("@/utils/writeJson");

const platform = require("@/platforms").map.kuaishou;

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, platform.url);

  // 等待请求用户信息，代表登录成功
  const infoResponses = [
    page.waitForResponse(
      (res) => res.url().includes("/rest/cp/creator/pc/home/userInfo"),
      { timeout: 60000 }
    ),
    page.waitForResponse((res) => res.url().includes("/pc/home/infoV2"), {
      timeout: 60000,
    }),
  ];

  const [infoResponse1, infoResponse2] = await Promise.all(infoResponses);

  const {
    data: { coreUserInfo: info },
  } = await infoResponse1.json();
  const { data: info2 } = await infoResponse2.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      kuaishou: {
        nickname: info.userName,
        avatar: info.headUrl,
        uid: info.userId,
        follower_count: info.fansNum,
        total_favorited: info2.likeCnt,
        total_play: 0,
      },
    };
  });

  console.log("✅ 快手，profile已更新");
};
