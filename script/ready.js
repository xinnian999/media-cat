const log = require("../utils/log");

const sh = async ({ context ,info}) => {
  const page = await context.newPage();

  await page.goto("http://localhost:3000");

  await log(page, "准备阶段");

  await log(page, "请填写信息");

  await page.waitForSelector('h1:has-text("确认信息")', {
    timeout: 0, // 无限等待
  });

  console.log(info);
  // await page.waitForSelector('h1:has-text("确认信息111")', {
  //   timeout: 0, // 无限等待
  // });

  await log(page, "信息已录入，即将开始脚本。。。");
};

module.exports = sh;
