module.exports = async ({ page, text }) => {
  // 监听页面响应
  page.on("response", async (response) => {
    try {
      const contentType = response.headers()["content-type"] || "";
      // 只处理文本响应，如 JSON 或 HTML
      if (
        contentType.includes("application/json") ||
        contentType.includes("text")
      ) {
        const body = await response.text();
        if (body.includes("也许再也不见")) {
          console.log(`找到了目标文本 in ${response.url()}`);
        }
      }
    } catch (err) {
      // 某些响应可能不是文本类型（如图片、PDF等），解析时会报错，忽略即可
    }
  });
};
