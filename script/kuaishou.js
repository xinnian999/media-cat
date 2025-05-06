const fs = require("fs");

const STATE_PATH = "./auth/kuaishou.json";

const sh = async ({ filePath, browser, desc, imitate }) => {
  // 判断是否已有登录状态文件
  const context = fs.existsSync(STATE_PATH)
    ? await browser.newContext({ storageState: STATE_PATH })
    : await browser.newContext();

  const page = await context.newPage();
  await page.goto("https://cp.kuaishou.com/");

  if (!fs.existsSync(STATE_PATH)) {
    console.log("请在浏览器中登录快手账号...");

    await page.waitForSelector('div:has-text("发布作品")', {
      timeout: 0, // 无限等待
    });

    await context.storageState({ path: STATE_PATH }); // 保存登录状态

    console.log("登录状态已保存，下次会自动登录");
  } else {
    console.log("已加载登录状态，自动登录成功");
  }

  // 点击“发布视频”
  await page.click(".publish-button");

  // 上传视频
  await page.setInputFiles('input[type="file"]', filePath);

  await page.waitForTimeout(3000);

  //可能会出现引导层，点击关闭
  const hasHelp = await page.locator("div.react-joyride__overlay").isVisible();
  if (hasHelp) {
    await page.click("._close_d7f44_29");
  }

  // 写入简介
  await page.locator("#work-description-edit").click();

  await page.locator("#work-description-edit").fill(desc);

  // 等待视频上传完成
  await page.waitForSelector('span:has-text("预览作品")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (imitate) {
    console.log("快手 -- 模拟流程完毕，跳过发布步骤");
    return;
  }

  await page.click("._button_3a3lq_1:has-text('发布')");

  // 检验是否上传成功
  await page.waitForSelector('h2:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  console.log("快手 -- 上传完成");
};

module.exports = sh;
