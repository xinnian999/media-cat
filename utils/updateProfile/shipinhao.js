const writeJson = require("@utils/writeJson");

module.exports = async (page) => {
  // 等待请求用户信息，代表登录成功
  await page.waitForResponse(
    (res) =>
      res.url().includes("/cgi-bin/mmfinderassistant-bin/auth/auth_data"),
    { timeout: 0 }
  );

  // const { data } = await response.json();

  // const { userAttr } = data;

  const usernameElement = await page.locator(".finder-nickname");

  const username = await usernameElement.textContent();

  const avatarElement = await page.locator(".finder-info-container .avatar");

  const avatar = await avatarElement.getAttribute("src");

  const uidElement = await page.locator(".finder-uniq-id");

  const uid = await uidElement.textContent();

  const followerCountElement = await page.locator(".second-info .finder-info-num");

  const followerCount = await followerCountElement.textContent();

  // 更新 profileData
  writeJson("cache/profile.json", (source) => {
    return {
      ...source,
      shipinhao: {
        nickname: username,
        avatar,
        uid,
        follower_count: followerCount,
        // following_count: info.following_count,
        // total_favorited: info.total_favorited,
      },
    };
  });

  console.log("✅ 视频号，profile已更新");
};
