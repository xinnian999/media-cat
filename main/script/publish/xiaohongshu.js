module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始发布到小红书", 0.1);

  await logger("等待页面完全渲染", 0.2);

  await page.waitForSelector(".publish-video .btn", {
    timeout: 0, // 无限等待
  });

  // 点击“发布视频”
  await logger("点击“发布笔记”", 0.3);
  await page.click(".publish-video .btn");

  // 导入视频
  await logger("导入视频", 0.4);
  await page.setInputFiles('input[type="file"]', url);

  await page.waitForTimeout(3000);

  // 写入简介
  await logger("写入简介", 0.6);
  await page.locator(".ql-editor").click();

  await page.locator(".ql-editor").fill(desc);

  if (tags.length > 0) {
    // 写入标签
    await logger("写入标签", 0.6);
    const input = page.locator(".ql-editor"); // 假设是 contenteditable 区域
    await input.click(); // 先 focus
    await input.type(` `);
    for (const tag of tags) {
      await input.type(`#${tag}`);
      await page.waitForSelector(".ql-mention-list", {
        timeout: 0, // 无限等待
      });
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
    }
  }

  // 等待视频导入完成
  await logger("等待视频导入完成", 0.8);
  await page.waitForSelector('div:has-text("上传成功")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (imitate) {
    await logger("小红书 -- 模拟流程完毕，跳过发布步骤", 1);
    return;
  }

  await logger("发布视频", 0.9);
  await page.click("button:has-text('发布')");

  // 检验是否上传成功
  await logger("等待视频发布完成", 0.9);
  await page.waitForSelector('p:has-text("发布成功")', {
    timeout: 0, // 无限等待
  });

  await logger("小红书发布成功！", 1);
};
