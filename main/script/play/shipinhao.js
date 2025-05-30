const { chromium } = require("playwright");
const { app } = require("electron");

module.exports = async (params) => {
  const browser = await chromium.launch({
    headless: !params.observe,
    channel: "chrome",
  });

  global.addBrowser("shipinhao", browser);

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/shipinhao.json`,
  });

  const page = await context.newPage();

  await page.goto("https://channels.weixin.qq.com/");

  await params.send({
    msg: "开始发布到视频号",
    percent: 0.1,
    page,
  });

  await params.send({
    msg: "等待页面完全渲染",
    percent: 0.2,
    page,
  });

  await page.waitForSelector('button:has-text("发表视频")', {
    timeout: 0, // 无限等待
  });

  // 点击“发表视频”
  await params.send({
    msg: "点击“发表视频”按钮",
    percent: 0.3,
    page,
  });
  await page.getByRole("button", { name: "发表视频" }).click();

  // 导入视频
  await params.send({
    msg: "导入视频",
    percent: 0.4,
    page,
  });
  await page.setInputFiles('input[type="file"]', params.url);

  // 写入简介
  await params.send({
    msg: "写入简介",
    percent: 0.5,
    page,
  });
  await page
    .locator(".post-desc-box .input-editor")
    .fill(
      params.desc +
        (params.tags.length > 0 ? ` #${params.tags.join(" #")}` : "")
    );

  await params.send({
    msg: "等待视频导入完成",
    percent: 0.7,
    page,
  });
  await page.waitForSelector('.tag-inner:has-text("删除")', {
    timeout: 0, // 无限等待
  });

  await params.send({
    msg: "视频导入完成！即将点击发布按钮",
    percent: 0.8,
    page,
  });
  await page.waitForTimeout(2000);

  // 如果 imitate 为 true，则不发布
  if (params.imitate) {
    await params.send({
      msg: "视频号 -- 模拟流程完毕，跳过发布步骤",
      percent: 1,
      page,
    });
    await global.removeBrowser("shipinhao");
    return;
  }

  await params.send({
    msg: "点击发布按钮，开始发布",
    percent: 0.9,
    page,
  });
  await page.getByRole("button", { name: "发表", exact: true }).click();

  await page.waitForTimeout(3000); // 等待发布完成

  // 检验是否上传成功
  await page.waitForSelector('span:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  await params.send({
    msg: "视频号发布成功！",
    percent: 1,
    page,
  });

  await global.removeBrowser("shipinhao");
};
