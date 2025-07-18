const { chromium } = require("playwright");

module.exports = async (e, { script }) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 收集图片 src 的容器
  const imageSrcSet = new Set();

  // 打开页面并输入提示词
  await page.goto("https://www.doubao.com/chat");
  await page.getByTestId("skill_bar_button_3").getByText("图像生成").click();
  await page.getByTestId("chat_input_input").fill(script);
  await page.getByTestId("chat_input_send_button").click();

  // 监听所有响应，筛选 png 图片
  page.on("response", async (response) => {
    try {
      const contentType = response.headers()["content-type"];
      const url = response.url();
      if (contentType && contentType.includes("image/png") && url.includes("p3-flow-imagex-sign")) {
      
        if (!imageSrcSet.has(url)) {
          imageSrcSet.add(url);
          console.log("🎯 捕获 PNG 图片：", url);
        }
      }
    } catch (err) {
      console.warn("处理 response 出错：", err.message);
    }
  });

  // 等待图片加载：可以使用延时，也可以监听 DOM（更稳）
  await page.waitForTimeout(60000); // 简单粗暴：等 8 秒（你可调成 5~10 秒）

  // await browser.close();
  return Array.from(imageSrcSet);
};
