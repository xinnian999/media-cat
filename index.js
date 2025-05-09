const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const douyin = require("./script/douyin");
const kuaishou = require("./script/kuaishou");

const STATE_PATH = "./cache.json";

const play = async (data) => {
  
  const browser = await chromium.launch({ headless: false });

  const context = fs.existsSync(STATE_PATH)
    ? await browser.newContext({ storageState: STATE_PATH })
    : await browser.newContext();

  const params = {
    context,
    info: {
      desc: "",
      filePath: path.join(__dirname, "./server/public/demo.mp4"),
      imitate: true,
      tags: [],
      ...data
    },
    saveState: async () => {
      await context.storageState({ path: STATE_PATH });
      console.log("浏览器状态已保存");
    }
  };

  await douyin(params);

  await kuaishou(params);

  console.log("所有平台分发完毕！");

  // await browser.close();
};

module.exports = play;
