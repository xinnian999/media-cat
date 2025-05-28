const { chromium } = require("playwright");
const { app } = require("electron");

module.exports = async (params) => {
  const browser = await chromium.launch({ headless: !params.observe });

  global.addBrowser("bilibili", browser);

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/bilibili.json`,
  });

  const page = await context.newPage();

  await page.goto("https://member.bilibili.com/");

  await params.send({
    msg: "开始分发B站",
    percent: 0.1,
    page,
  });

  await params.send({
    msg: "点击投稿",
    percent: 0.2,
    page,
  });

  await page.waitForSelector('div:has-text("投稿")', {
    timeout: 0, // 无限等待
  });

  await page.click("#nav_upload_btn");

  // 导入视频
  await params.send({
    msg: "导入视频",
    percent: 0.4,
    page,
  });

  await page.setInputFiles('input[type="file"]', params.url);

  // 导入视频
  await params.send({
    msg: "填写标题",
    percent: 0.4,
    page,
  });

  await page.locator(".video-title-content input").fill(params.desc);
};
