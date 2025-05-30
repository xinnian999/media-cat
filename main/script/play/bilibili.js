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

  await params.send({
    msg: "导入视频",
    percent: 0.3,
    page,
  });

  await page.setInputFiles('input[type="file"]', params.url);

  await params.send({
    msg: "填写标题",
    percent: 0.4,
    page,
  });
  await page.locator(".video-title-content input").fill(params.desc);

  await params.send({
    msg: "选择分类",
    percent: 0.5,
    page,
  });
  await page.locator(".select-controller").first().click();
  await page.getByTitle("娱乐").click();

  if (params.tags.length > 0) {
    // 写入标签
    await params.send({
      msg: "写入标签",
      percent: 0.6,
      page,
    });

    await page.getByRole("textbox", { name: "按回车键Enter创建标签" }).click();

    await page.waitForTimeout(2000);

    async function runSerially() {
      for (const tag of params.tags) {
        await page
          .getByRole("textbox", { name: "按回车键Enter创建标签" })
          .fill(tag);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(1000);
      }
    }
    await runSerially();
  }

  await params.send({
    msg: "等待视频导入完成",
    percent: 0.7,
    page,
  });
  await page.waitForSelector('span:has-text("上传完成")', {
    timeout: 0, // 无限等待
  });
  await params.send({
    msg: "视频导入完成！即将点击发布按钮",
    percent: 0.8,
    page,
  });

  // 如果 imitate 为 true，则不发布
  if (params.imitate) {
    await params.send({
      msg: "B站 -- 模拟流程完毕，跳过发布步骤",
      percent: 1,
      page,
    });

    await global.clearBrowser("bilibili");

    return;
  }

  await params.send({
    msg: "点击发布按钮，开始发布",
    percent: 0.9,
    page,
  });
  await page.locator("span:has-text('立即投稿')").click();

  // 检验是否上传成功
  await page.waitForSelector('div:has-text("稿件投递成功")', {
    timeout: 0, // 无限等待
  });

  await params.send({
    msg: "B站发布成功！",
    percent: 1,
    page,
  });

  await global.clearBrowser("bilibili");
};
