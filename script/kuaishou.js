const log = require("../utils/log");

const sh = async ({ info, context, saveState }) => {
  const page = await context.newPage();

  await page.goto("https://cp.kuaishou.com/");

  await log(page, "开始分发快手");

  await log(page, "等待页面完全渲染");

  await page.waitForSelector('div:has-text("发布作品")', {
    timeout: 0, // 无限等待
  });

  // 点击“发布视频”
  await log(page, "点击“发布视频”");
  await page.click(".publish-button");

  // 导入视频
  await log(page, "导入视频");
  await page.setInputFiles('input[type="file"]', info.url);

  await page.waitForTimeout(3000);

  //可能会出现引导层，点击关闭
  const hasHelp = await page.locator("div.react-joyride__overlay").isVisible();
  if (hasHelp) {
    await log(page, "出现引导层，点击关闭");
    await page.click("._close_d7f44_29");
  }

  // 写入简介
  await log(page, "写入简介");
  await page.locator("#work-description-edit").click();

  await page.locator("#work-description-edit").fill(info.desc);

  // 写入标签
  await log(page, "写入标签");
  const input = page.locator("#work-description-edit"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  await input.type(" "); // 先 focus
  async function runSerially() {
    for (const tag of info.tags) {
      await input.type(`#${tag} `);
    }
  }
  await runSerially();

  // 等待视频导入完成
  await log(page, "等待视频导入完成");
  await page.waitForSelector('span:has-text("预览作品")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (info.imitate) {
    await log(page, "快手 -- 模拟流程完毕，跳过发布步骤");
    return;
  }

  await log(page, "发布视频");
  await page.click("._button_3a3lq_1:has-text('发布')");

  // 检验是否上传成功
  await log(page, "等待视频发布完成");
  await page.waitForSelector('h2:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  await log(page, "快手发布成功！");
};

module.exports = sh;
