const writeJson = require("@/utils/writeJson");

const url = "https://creator.kuaishou.com/";

module.exports = async (page) => {
  await page.evaluate((url) => {
    window.location.href = url;
  }, url);

  // 等待请求用户信息，代表登录成功
  const infoResponses = [
    page.waitForResponse((res) =>
      res.url().includes("/rest/cp/creator/pc/home/userInfo")
    ),
    page.waitForResponse((res) => res.url().includes("/pc/home/infoV2")),
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
        url,
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
