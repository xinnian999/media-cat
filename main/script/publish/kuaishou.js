module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始分发快手", 0.1);
  await page.waitForSelector('div:has-text("发布作品")', {
    timeout: 0, // 无限等待
  });

  // 点击“发布视频”
  await logger("点击“发布视频”", 0.3);
  await page.click(".publish-button");

  // 导入视频
  await logger("导入视频", 0.4);
  await page.setInputFiles('input[type="file"]', url);

  await page.waitForTimeout(3000);

  //可能会出现引导层，点击关闭
  const hasHelp = await page.locator("div.react-joyride__overlay").isVisible();
  if (hasHelp) {
    await logger("出现引导层，点击关闭", 0.5);
    await page.click("._close_d7f44_29");
  }

  // 写入简介
  await logger("写入简介", 0.6);
  await page.locator("#work-description-edit").click();

  await page.locator("#work-description-edit").fill(desc);

  // 写入标签
  await logger("写入标签", 0.7);
  const input = page.locator("#work-description-edit"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  await input.type(` `);
  for (const tag of tags) {
    await input.type(`#${tag}`);
    await input.type(` `);
  }

  // 等待视频导入完成
  await logger("等待视频导入完成", 0.8);
  await page.waitForSelector('span:has-text("预览作品")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (imitate) {
    await logger("快手 -- 模拟流程完毕，跳过发布步骤", 1, "success");
    return;
  }

  await logger("发布视频", 0.9);
  await page.click("._button_3a3lq_1:has-text('发布')");

  // 检验是否上传成功
  await logger("等待视频发布完成", 0.9);
  await page.waitForSelector('h2:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  await logger("快手发布成功！", 1, "success");
};
