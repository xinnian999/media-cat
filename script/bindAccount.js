const { chromium } = require("playwright");
const path = require("path");

const STATE_PATH = "./cache.json";

const bindAccount = async (url) => {
  
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext()

  const page = await context.newPage();

  await page.goto(url);

//   const params = {
//     saveState: async () => {
//       await context.storageState({ path: STATE_PATH });
//       console.log("浏览器状态已保存");
//     }
//   };

  // await browser.close();
};

module.exports = bindAccount;
