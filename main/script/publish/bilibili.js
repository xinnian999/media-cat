module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始分发B站", 0.1);

  await logger("点击投稿", 0.2);
  await page.waitForSelector('div:has-text("投稿")', {
    timeout: 0, // 无限等待
  });
  await page.click("#nav_upload_btn");

  await logger("导入视频", 0.3);
  await page.setInputFiles('input[type="file"]', url);

  await logger("填写标题", 0.4);
  await page.locator(".video-title-content input").fill(desc);

  await logger("选择分类", 0.5);
  await page.locator(".select-controller").first().click();
  await page.getByTitle("娱乐").click();

  if (tags.length > 0) {
    // 写入标签
    await logger("写入标签", 0.6);

    await page.getByRole("textbox", { name: "按回车键Enter创建标签" }).click();

    await page.waitForTimeout(2000);

    for (const tag of tags) {
      await page
        .getByRole("textbox", { name: "按回车键Enter创建标签" })
        .fill(tag);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(1000);
    }
  }

  await logger("等待视频导入完成", 0.7);
  await page.waitForSelector('span:has-text("上传完成")', {
    timeout: 0, // 无限等待
  });
  await logger("视频导入完成！即将点击发布按钮", 0.8);

  // 如果 imitate 为 true，则不发布
  if (imitate) {
    await logger("B站 -- 模拟流程完毕，跳过发布步骤", 1, "success");
    return;
  }

  await logger("点击发布按钮，开始发布", 0.9);
  await page.locator("span:has-text('立即投稿')").click();

  // 检验是否上传成功
  await page.waitForSelector('div:has-text("稿件投递成功")', {
    timeout: 0, // 无限等待
  });

  await logger("B站发布成功！", 1, "success");
};
