const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const createServer = require("./server");

const ready = require("./script/ready");
const douyin = require("./script/douyin");
const kuaishou = require("./script/kuaishou");

const STATE_PATH = "./cache.json";

(async () => {
  const browser = await chromium.launch({ headless: false });

  const context = fs.existsSync(STATE_PATH)
    ? await browser.newContext({ storageState: STATE_PATH })
    : await browser.newContext();

  const params = {
    context,
    info: {
      title: "",
      desc: "",
      filePath: path.join(__dirname, "./server/public/demo.mp4"),
    },
    imitate: false,
    saveState: async () => {
      await context.storageState({ path: STATE_PATH });
      console.log("浏览器状态已保存");
    },
    setInfo: (data) => {
      Object.assign(params.info, data);
    },
  };

  await createServer({ port: 3000, setInfo: params.setInfo });

  await ready(params);

  await douyin(params);

  await kuaishou(params);

  console.log("所有平台分发完毕！");

  // await browser.close();
})();
