const log = require("../utils/log");

const sh = async ({ info, context, saveState }) => {
  const page = await context.newPage();

  await page.goto("https://creator.douyin.com/");

  await log(page, "开始分发抖音");

  await log(page, "正在等待页面完全渲染");

  await page.waitForTimeout(3000); // 等待页面完全渲染

  await log(page, "页面完全渲染，开始登录");

  // 判断是否需要登录
  const isUnLogin = await page.locator('span:has-text("扫码登录")').isVisible();

  if (isUnLogin) {
    log(page, "请在浏览器中登录抖音账号...");

    await page.waitForSelector('button:has-text("发布视频")', {
      timeout: 0, // 无限等待
    });

    await saveState();
  } else {
    log(page, "已加载登录状态，自动登录成功");
  }

  // 点击“发布视频”
  await log(page, "点击“发布视频”按钮");
  await page.getByRole("button", { name: "发布视频" }).click();

  // 导入视频
  await log(page, "导入视频");
  await page.setInputFiles('input[type="file"]', info.filePath);

  // 写入简介
  await log(page, "写入简介");
  await page.locator(".zone-container").click();
  await page.locator(".zone-container").fill(info.desc);

  // 写入标签
  await log(page, "写入标签");
  const input = page.locator(".zone-container"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  async function runSerially() {
    for (const tag of info.tags) {
      await input.type(`#${tag} `);
    }
  }
  await runSerially();

  // 发布
  await log(page, "等待视频导入完成");
  await page.waitForSelector('div:has-text("重新上传")', {
    timeout: 0, // 无限等待
  });

  await log(page, "视频导入完成！即将点击发布按钮");
  await page.waitForTimeout(2000);

  // 如果 imitate 为 true，则不发布
  if (info.imitate) {
    log(page, "抖音 -- 模拟流程完毕，跳过发布步骤");
    return;
  }

  await log(page, "点击发布按钮，开始发布");
  await page.getByRole("button", { name: "发布", exact: true }).click();

  await page.waitForTimeout(3000); // 等待上传完成

  //可能会出现风控验证，需要手动处理
  const hasVerify = await page
    .locator('div:has-text("接收短信验证码")')
    .isVisible();

  if (hasVerify) {
    await log(page, "出现风控验证，请手动处理");
  }

  // 检验是否上传成功
  await page.waitForSelector('div:has-text("作品管理")', {
    timeout: 0, // 无限等待
  });

  await log(page, "抖音发布成功！");
};

module.exports = sh;
