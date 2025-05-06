const log = require("../utils/log");

const sh = async ({ filePath, title, desc, imitate, context, saveState }) => {
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
  await page.getByRole("button", { name: "发布视频" }).click();
  await log(page, "点击“发布视频”按钮");

  // 导入视频
  await page.setInputFiles('input[type="file"]', filePath);
  await log(page, "开始导入视频");

  // 写入标题
  await page
    .getByRole("textbox", { name: "填写作品标题，为作品获得更多流量" })
    .click();
  await page
    .getByRole("textbox", { name: "填写作品标题，为作品获得更多流量" })
    .fill(title);
  await log(page, "写入标题成功");

  // 写入简介
  await page.locator(".zone-container").click();
  await page.locator(".zone-container").fill(desc);
  await log(page, "写入简介成功");

  // 发布
  await log(page, "正在等待视频导入完成");
  await page.waitForSelector('div:has-text("重新上传")', {
    timeout: 0, // 无限等待
  });

  await log(page, "视频导入完成！即将点击发布按钮");
  await page.waitForTimeout(2000);

  // 如果 imitate 为 true，则不发布
  if (imitate) {
    log(page, "抖音 -- 模拟流程完毕，跳过发布步骤");
    return;
  }

  await log(page, "点击发布按钮，开始发布");
  await page.getByRole("button", { name: "发布", exact: true }).click();

  //可能会出现风控验证，需要手动处理
  const hasVerify = await page
    .locator('div:has-text("接收短信验证码")')
    .isVisible();
  if (hasVerify) {
    console.log("出现风控验证，请手动处理");
  }

  // 检验是否上传成功
  await page.waitForSelector('div:has-text("作品管理")', {
    timeout: 0, // 无限等待
  });
  await log(page, "抖音发布成功！");

  console.log("抖音 -- 上传完成");
};

module.exports = sh;
