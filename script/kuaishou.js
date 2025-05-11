const log = require("../utils/log");
const { chromium } = require("playwright");
const fs = require("fs");

const STATE_PATH = "cache/storageState/kuaishou.json";

const kuaishou = async (params) => {
  const browser = await chromium.launch({ headless: true });

  const context = fs.existsSync(STATE_PATH)
    ? await browser.newContext({ storageState: STATE_PATH })
    : await browser.newContext();

  const page = await context.newPage({
    storageState: STATE_PATH,
  });

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
  await page.setInputFiles('input[type="file"]', params.url);

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

  await page.locator("#work-description-edit").fill(params.desc);

  // 写入标签
  await log(page, "写入标签");
  const input = page.locator("#work-description-edit"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  await input.type(" "); // 先 focus
  async function runSerially() {
    for (const tag of params.tags) {
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

  if (params.imitate) {
    await log(page, "快手 -- 模拟流程完毕，跳过发布步骤");
    await browser.close();
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

  await browser.close();
};

module.exports = kuaishou;
