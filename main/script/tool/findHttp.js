const { chromium } = require("playwright");
const getMergeStorageState = require("@/utils/getMergeStorageState");

module.exports = async ({ url, keyword }) => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: getMergeStorageState(),
  });

  const page = await context.newPage();

  const httpList = [];

  page.on("response", async (response) => {
    const contentType = response.headers()["content-type"] || "";
    if (contentType.includes("application/json")) {
      try {
        const text = await response.text();
        const json = JSON.parse(text); // 明确捕获 JSON.parse 可能的异常
        const jsonString = JSON.stringify(json);
        if (jsonString.includes(keyword)) {
          httpList.push({
            url: response.url(),
            origin: response.url().split("?")[0],
            data: json
          });
        }
      } catch (err) {
        if (process.env.DEBUG) {
          console.warn("Failed to parse JSON from:", response.url());
          console.error(err);
        }
        // 无需 throw，忽略即可
      }
    }
  });

  await page.goto(url);
  await page.waitForTimeout(3000); // 等待异步加载的请求

  await browser.close();

  return httpList;
};
