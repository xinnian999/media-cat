const { chromium } = require("playwright");
const fs = require("fs");
const  selectFile  = require("./utils/selectFile");

const douyin = require("./script/douyin");
const kuaishou = require("./script/kuaishou");

const STATE_PATH = "./cache.json";

(async () => {
  const filePath = await selectFile();

  const browser = await chromium.launch({ headless: false });

  const context = fs.existsSync(STATE_PATH)
    ? await browser.newContext({ storageState: STATE_PATH })
    : await browser.newContext();

  const params = {
    browser,
    filePath: filePath,
    title: "我的王者精彩瞬间222",
    desc: "我的王者精彩瞬间，亮瞎全场 #王者荣耀",
    imitate: true,
    saveState: async () => {
      await context.storageState({ path: STATE_PATH });
      console.log("浏览器状态已保存");
    },
    context
  };

  await douyin(params);

  await kuaishou(params);

  console.log("所有平台分发完毕！");

  // await browser.close();
})();
