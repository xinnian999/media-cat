const { getVideoDurationInSeconds } = require("get-video-duration");

module.exports = async ({ page, logger, url, desc, tags, imitate }) => {
  await logger("开始发布到微视", 0.1);

  await logger("等待页面完全渲染", 0.2);

  // 检查视频时长（单位：秒）
  const duration = await getVideoDurationInSeconds(url);

  // 验证时长是否超过3分钟（180秒）
  if (duration > 180) {
    throw new Error(
      `视频时长超过3分钟（当前: ${duration}秒），微视不支持发布超过3分钟的视频`
    );
  }

  await page.waitForSelector("span:has-text('视频上传')", {
    timeout: 0, // 无限等待
  });

  // 导入视频
  await logger("导入视频", 0.4);
  await page.setInputFiles('input[type="file"]', url);

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

  await logger("微视发布成功！", 1, "success");
};
