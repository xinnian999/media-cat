const path = require("path");
const { chromium } = require("playwright");

const douyin = require("./script/douyin");
const kuaishou = require("./script/kuaishou");

// 获取视频文件的绝对路径（假设 videoFilePath 在项目根目录下）
const filePath = path.join(__dirname, "./demo.mp4"); // 使用相对路径构造绝对路径

(async () => {
  const browser = await chromium.launch({ headless: false });

  const params = {
    browser,
    filePath,
    title: "我的王者精彩瞬间222",
    desc: "我的王者精彩瞬间，亮瞎全场 #王者荣耀",
  };

  // await douyin(params);

  await kuaishou(params);

  // await browser.close();
})();
