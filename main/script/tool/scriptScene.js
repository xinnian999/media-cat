const { chromium } = require("playwright");

module.exports = async (e, { script }) => {
  const browser = await chromium.launch({ headless: false, channel: "chrome" });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 收集图片 src 的容器
    const imageSrcSet = new Set();

    // 打开页面并输入提示词
    await page.goto("https://www.doubao.com/chat");

    // 缩放网页内容到 25%
    // await page.evaluate(() => {
    //   document.body.style.zoom = "0.25";
    // });

    // const isVisible = await page
    //   .getByTestId("skill_bar_button_3")
    //   .getByText("图像生成")
    //   .isVisible();

    // console.log("isVisible", isVisible);

    await page.getByTestId("skill_bar_button_3").getByText("图像生成").click();
    await page.getByTestId("chat_input_input").fill(script);

    // 监听所有响应，筛选 png 图片
    page.on("response", async (response) => {
      try {
        const contentType = response.headers()["content-type"];
        const url = response.url();
        if (
          contentType &&
          contentType.includes("image/png") &&
          url.includes("p3-flow-imagex-sign")
        ) {
          if (!imageSrcSet.has(url)) {
            imageSrcSet.add(url);
            console.log("🎯 捕获 PNG 图片：", url);
          }
        }
      } catch (err) {
        console.warn("处理 response 出错：", err.message);
      }
    });

    await page.getByTestId("chat_input_send_button").click();

    await page.waitForTimeout(10000);

    await page.waitForSelector(".break-btn-Rv8NnA", {
      state: "hidden",
      timeout: 0,
    });

    await page.waitForTimeout(20000);

    return Array.from(imageSrcSet);
  } catch (error) {
    console.error("Error in scriptScene:", error);
    throw error;
  } finally {
    // await browser.close();
  }
};
