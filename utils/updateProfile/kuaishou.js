const writeJson = require("@utils/writeJson");

module.exports = async (page) => {
  await page.evaluate(() => {
    window.location.href = "https://creator.kuaishou.com/";
  });

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse((res) =>
    res.url().includes("/rest/cp/creator/pc/home/userInfo")
  );

  const {
    data: { coreUserInfo: info },
  } = await response.json();

  // 更新 profileData
  writeJson("cache/profile.json", (profileData) => {
    return {
      ...profileData,
      kuaishou: {
        nickname: info.userName,
        avatar: info.headUrl,
        uid: info.userId,
        follower_count: info.fansNum,
      },
    };
  });

  console.log("✅ 快手，profile已更新");
};
