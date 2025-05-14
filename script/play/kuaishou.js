const { chromium } = require("playwright");
const { app } = require("electron");

const kuaishou = async (params) => {
  const browser = await chromium.launch({ headless: !params.observe });

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/kuaishou.json`,
  });

  const page = await context.newPage();

  await page.goto("https://cp.kuaishou.com/");

  await params.send({
    msg: "开始分发快手",
    percent: 0.1,
    page,
  });

  await params.send({
    msg: "等待页面完全渲染",
    percent: 0.2,
    page,
  });

  await page.waitForSelector('div:has-text("发布作品")', {
    timeout: 0, // 无限等待
  });

  // 点击“发布视频”
  await params.send({
    msg: "点击“发布视频”",
    percent: 0.3,
    page,
  });
  await page.click(".publish-button");

  // 导入视频
  await params.send({
    msg: "导入视频",
    percent: 0.4,
    page,
  });
  await page.setInputFiles('input[type="file"]', params.url);

  await page.waitForTimeout(3000);

  //可能会出现引导层，点击关闭
  const hasHelp = await page.locator("div.react-joyride__overlay").isVisible();
  if (hasHelp) {
    await params.send({
      msg: "出现引导层，点击关闭",
      percent: 0.5,
      page,
    });
    await page.click("._close_d7f44_29");
  }

  // 写入简介
  await params.send({
    msg: "写入简介",
    percent: 0.6,
    page,
  });
  await page.locator("#work-description-edit").click();

  await page.locator("#work-description-edit").fill(params.desc);

  // 写入标签
  await params.send({
    msg: "写入标签",
    percent: 0.7,
    page,
  });
  const input = page.locator("#work-description-edit"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  await input.type(` `);
  async function runSerially() {
    for (const tag of params.tags) {
      await input.type(`#${tag}`);
      await input.type(` `);
    }
  }
  await runSerially();

  // 等待视频导入完成
  await params.send({
    msg: "等待视频导入完成",
    percent: 0.8,
    page,
  });
  await page.waitForSelector('span:has-text("预览作品")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (params.imitate) {
    await params.send({
      msg: "快手 -- 模拟流程完毕，跳过发布步骤",
      percent: 1,
      page,
    });
    await browser.close();
    return;
  }

  await params.send({
    msg: "发布视频",
    percent: 0.9,
    page,
  });
  await page.click("._button_3a3lq_1:has-text('发布')");

  // 检验是否上传成功
  await params.send({
    msg: "等待视频发布完成",
    percent: 0.9,
    page,
  });
  await page.waitForSelector('h2:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  await params.send({
    msg: "快手发布成功！",
    percent: 1,
    page,
  });

  await browser.close();
};

module.exports = kuaishou;
