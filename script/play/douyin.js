const { chromium } = require("playwright");
const { app } = require("electron");

const douyin = async (params) => {
  const browser = await chromium.launch({ headless: !params.observe });

  params.addBrowser(browser)

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/douyin.json`,
  });

  const page = await context.newPage();

  await page.goto("https://creator.douyin.com/");

  await params.send({
    msg: "开始分发抖音",
    percent: 0.1,
    page,
  });

  await params.send({
    msg: "等待页面完全渲染",
    percent: 0.2,
    page,
  });

  await page.waitForSelector('button:has-text("发布视频")', {
    timeout: 0, // 无限等待
  });

  // 点击“发布视频”
  await params.send({
    msg: "点击“发布视频”按钮",
    percent: 0.3,
    page,
  });
  await page.getByRole("button", { name: "发布视频" }).click();

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
  await page.locator(".zone-container").click();
  await page.locator(".zone-container").fill(params.desc);

  // 写入标签
  await params.send({
    msg: "写入标签",
    percent: 0.6,
    page,
  });
  const input = page.locator(".zone-container"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  async function runSerially() {
    for (const tag of params.tags) {
      await input.type(`#${tag} `);
    }
  }
  await runSerially();

  // 发布
  await params.send({
    msg: "等待视频导入完成",
    percent: 0.7,
    page,
  });
  await page.waitForSelector('div:has-text("重新上传")', {
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
      msg: "抖音 -- 模拟流程完毕，跳过发布步骤",
      percent: 1,
      page,
    });
    await browser.close();
    return;
  }

  await params.send({
    msg: "点击发布按钮，开始发布",
    percent: 0.9,
    page,
  });
  await page.getByRole("button", { name: "发布", exact: true }).click();

  await page.waitForTimeout(3000); // 等待上传完成

  //可能会出现风控验证，需要手动处理
  const hasVerify = await page
    .locator('div:has-text("接收短信验证码")')
    .isVisible();

  if (hasVerify) {
    await params.send({
      msg: "出现风控验证，请手动处理",
      percent: 0.9,
      page,
    });
  }

  // 检验是否上传成功
  await page.waitForSelector('div:has-text("作品管理")', {
    timeout: 0, // 无限等待
  });

  await params.send({
    msg: "抖音发布成功！",
    percent: 1,
    page,
  });

  await browser.close();
};

module.exports = douyin;
