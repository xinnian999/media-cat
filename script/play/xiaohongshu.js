const { chromium } = require("playwright");
const { app } = require("electron");

const xiaohongshu = async (params) => {
  const browser = await chromium.launch({ headless: !params.observe });

  const context = await browser.newContext({
    storageState: `${app.getPath("userData")}/cache/storageState/xiaohongshu.json`,
  });

  const page = await context.newPage();

  await page.goto("https://creator.xiaohongshu.com/");

  await params.send({
    msg: "开始发布到小红书",
    percent: 0.1,
    page,
  });

  await params.send({
    msg: "等待页面完全渲染",
    percent: 0.2,
    page,
  });

  await page.waitForSelector('a:has-text("发布笔记")', {
    timeout: 0, // 无限等待
  });

  // 点击“发布视频”
  await params.send({
    msg: "点击“发布笔记”",
    percent: 0.3,
    page,
  });
  await page.click(".publish-video .btn");

  // 导入视频
  await params.send({
    msg: "导入视频",
    percent: 0.4,
    page,
  });
  await page.setInputFiles('input[type="file"]', params.url);

  await page.waitForTimeout(3000);

  // 写入简介
  await params.send({
    msg: "写入简介",
    percent: 0.6,
    page,
  });
  await page.locator(".ql-editor").click();

  await page.locator(".ql-editor").fill(params.desc);

  if (params.tags.length > 0) {
    // 写入标签
    await params.send({
      msg: "写入标签",
      percent: 0.7,
      page,
    });
    const input = page.locator(".ql-editor"); // 假设是 contenteditable 区域
    const tagText = params.tags.join(" #");
    await input.type(` #${tagText}`); // 先 focus
  }

  // 等待视频导入完成
  await params.send({
    msg: "等待视频导入完成",
    percent: 0.8,
    page,
  });
  await page.waitForSelector('div:has-text("上传成功")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (params.imitate) {
    await params.send({
      msg: "小红书 -- 模拟流程完毕，跳过发布步骤",
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
  await page.click("button:has-text('发布')");

  // 检验是否上传成功
  await params.send({
    msg: "等待视频发布完成",
    percent: 0.9,
    page,
  });
  await page.waitForSelector('p:has-text("发布成功")', {
    timeout: 0, // 无限等待
  });

  await params.send({
    msg: "小红书发布成功！",
    percent: 1,
    page,
  });

  await browser.close();
};

module.exports = xiaohongshu;
