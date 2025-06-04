module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始发布到视频号", 0.1);

  await page.waitForSelector('button:has-text("发表视频")', {
    timeout: 0, // 无限等待
  });

  // 点击“发表视频”
  await logger("点击“发表视频”按钮", 0.3);
  await page.getByRole("button", { name: "发表视频" }).click();

  // 导入视频
  await logger("导入视频", 0.4);
  await page.setInputFiles('input[type="file"]', url);

  // 写入简介
  await logger("写入简介", 0.5);
  await page
    .locator(".post-desc-box .input-editor")
    .fill(desc + (tags.length > 0 ? ` #${tags.join(" #")}` : ""));

  await logger("等待视频导入完成", 0.7);
  await page.waitForSelector('.tag-inner:has-text("删除")', {
    timeout: 0, // 无限等待
  });

  await logger("视频导入完成！即将点击发布按钮", 0.8);
  await page.waitForTimeout(2000);

  // 如果 imitate 为 true，则不发布
  if (imitate) {
    await logger("视频号 -- 模拟流程完毕，跳过发布步骤", 1);
    return;
  }

  await logger("点击发布按钮，开始发布", 0.9);
  await page.getByRole("button", { name: "发表", exact: true }).click();

  await page.waitForTimeout(3000); // 等待发布完成

  // 检验是否上传成功
  await page.waitForSelector('span:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  await logger("视频号发布成功！", 1);
};
