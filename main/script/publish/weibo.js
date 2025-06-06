module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始发布到微博", 0.1);

  await logger("等待页面完全渲染", 0.2);

  // 导入视频
  await logger("导入视频", 0.4);
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("button", { name: "上传视频" }).click(),
  ]);
  await fileChooser.setFiles(url);

  await page.waitForTimeout(3000);

  // 写入简介
  await logger("写入简介", 0.5);
  await page
    .locator(".ant-mentions textarea")
    .fill(desc + (tags.length > 0 ? ` #${tags.join(" #")}` : ""));

  // 等待视频导入完成
  await logger("等待视频导入完成", 0.8);
  await page.waitForSelector('div:has-text("更换视频")', {
    timeout: 0, // 无限等待
  });

  await page.waitForTimeout(2000);

  if (imitate) {
    await logger("微视 -- 模拟流程完毕，跳过发布步骤", 1, "success");
    return;
  }

  await logger("发布视频", 0.9);
  await page.getByRole("button", { name: "发 布", exact: false }).click();

  // 检验是否上传成功
  await logger("等待视频发布完成", 0.9);
  await page.waitForSelector('div:has-text("视频管理")', {
    timeout: 0, // 无限等待
  });

  await logger("微视发布成功！", 1);
};
