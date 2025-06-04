module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始分发抖音", 0.1);
  await page.waitForSelector(
    ':is(button:has-text("发布视频"), button:has-text("高清发布"))',
    {
      timeout: 0, // 无限等待
    }
  );

  await logger("点击“发布视频”按钮", 0.2);
  await page
    .locator(':is(button:has-text("发布视频"), button:has-text("高清发布"))')
    .click();

  await logger("导入视频", 0.4);
  await page.setInputFiles('input[type="file"]', url);

  await logger("写入简介", 0.5);
  await page.locator(".zone-container").click();
  await page.locator(".zone-container").fill(desc);

  await logger("写入标签", 0.6);
  const input = page.locator(".zone-container"); // 假设是 contenteditable 区域
  await input.click(); // 先 focus
  for (const tag of tags) {
    await input.type(`#${tag} `);
  }

  await logger("等待视频导入完成", 0.7);
  await page.waitForSelector('div:has-text("重新上传")', {
    timeout: 0, // 无限等待
  });

  await logger("视频导入完成！即将点击发布按钮", 0.8);
  await page.waitForTimeout(2000);

  // 如果 imitate 为 true，则不发布
  if (imitate) {
    await logger("抖音 -- 模拟流程完毕，跳过发布步骤", 1);
    return;
  }

  await logger("点击发布按钮，开始发布", 0.9);
  await page.getByRole("button", { name: "发布", exact: true }).click();

  // 检验是否上传成功
  await page.waitForSelector('div:has-text("作品管理")', {
    timeout: 0, // 无限等待
  });

  await logger("抖音发布成功！", 1);
};
