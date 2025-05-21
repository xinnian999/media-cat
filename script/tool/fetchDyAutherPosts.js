const { chromium } = require("playwright");

module.exports = async ({ url, addBrowser }) => {
  const browser = await chromium.launch({ headless: true });
  addBrowser(browser);

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);

  // 等待请求用户信息，代表登录成功
  const response = await page.waitForResponse(
    (res) => res.url().includes("/aweme/post"),
    { timeout: 0 }
  );

  const { aweme_list } = await response.json();

  return aweme_list;
};
