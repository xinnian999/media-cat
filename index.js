const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const STATE_PATH = "./cache/status.json";

const play = async (data) => {
  const browser = await chromium.launch({ headless: false });

  const context = fs.existsSync(STATE_PATH)
    ? await browser.newContext({ storageState: STATE_PATH })
    : await browser.newContext();

  const params = {
    context,
    info: {
      desc: "",
      url: path.join(__dirname, "./server/public/demo.mp4"),
      imitate: true,
      tags: [],
      ...data,
    },
    saveState: async () => {
      await context.storageState({ path: STATE_PATH });
      console.log("浏览器状态已保存");
    },
  };


  const scripts = data.platform.map(async (plat) => {
    const script = require(`./script/${plat}`);
    
    return await script(params);
  });

  await Promise.all(scripts);

  console.log("所有平台分发完毕！");

  // await browser.close();
};

module.exports = play;
