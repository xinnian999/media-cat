const { dialog, ipcMain, app } = require("electron");

const readJson = require("@utils/readJson");

const writeJson = require("@utils/writeJson");

const log = require("@utils/log");

const { randomUUID } = require("crypto");

const dayjs = require("dayjs");

const browsers = [];

module.exports = (win) => {
  const handles = {
    defaultDownloadPath: () => {
      return app.getPath("downloads");
    },
    "dialog:openFile": async () => {
      const result = await dialog.showOpenDialog(win, {
        properties: ["openFile"],
      });

      return result.filePaths[0]; // 返回选择的文件路径
    },
    "dialog:openFolder": async () => {
      const result = await dialog.showOpenDialog(win, {
        properties: ["openDirectory"],
      });

      return result.filePaths[0]; // 返回选择的文件路径
    },
    openFile: async (e, path) => {
      const { shell } = require("electron");
      shell.showItemInFolder(path);
    },
    bindAccount: async (e, plat) => {
      const bind = require(`@script/bind/${plat}`);
      await bind();
    },
    play: async (e, data) => {
      const scripts = data.platforms.map(async (plat) => {
        const script = require(`@script/play/${plat}`);
        const params = {
          ...data,
          send: async ({ page, ...rest }) => {
            e.sender.send("upload-progress", {
              ...rest,
              platform: plat,
            });
            await log(page, rest.msg);
            await page.waitForTimeout(3000);
          },
          addBrowser: (browser) => {
            browsers.push(browser);
          },
        };

        return await script(params);
      });

      writeJson("cache/publishLog.json", (source) => {
        const newData = {
          ...data,
          id: randomUUID(),
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };

        if (source.list) {
          return { list: [newData, ...source.list] };
        }

        return { list: [newData] };
      });

      await Promise.all(scripts);
    },
    publishLog: () => {
      return readJson("cache/publishLog.json");
    },
    profile: () => {
      return readJson("cache/profile.json");
    },
    updateProfile: require("@script/updateProfile"),
    downloadVideo: require("@script/tool/downloadVideo"),
    dyAuthers: () => {
      return readJson("cache/dyAuthers.json");
    },
    getDyAuther: async (e, id) => {
      const dyAuthers = readJson("cache/dyAuthers.json");
      const dyAuther = dyAuthers.list.find((item) => item.id === id);
      if (dyAuther) {
        return dyAuther;
      }
      return null;
    },
    addDyAuther: async (e, autherUrl) => {
      const addDyAuther = require("@script/tool/addDyAuther");
      return await addDyAuther({
        autherUrl,
        addBrowser: (browser) => {
          browsers.push(browser);
        },
      });
    },
    updateDyAuther: async (e, autherUrl) => {
      const updateDyAuther = require("@script/tool/updateDyAuther");
      return await updateDyAuther({
        autherUrl,
        addBrowser: (browser) => {
          browsers.push(browser);
        },
      });
    },
    deleteDyAuther: async (e, id) => {
      const dyAuthers = readJson("cache/dyAuthers.json");
      const newDyAuthers = dyAuthers.list.filter((item) => item.id !== id);
      writeJson("cache/dyAuthers.json", () => {
        return { list: newDyAuthers };
      });
    },
    dyAutherPosts: () => {
      return readJson("cache/dyAutherPosts.json");
    },
    findHttp: async (e, data) => {
      const findHttp = require("@script/tool/findHttp");
      return await findHttp({
        url: data.url,
        keyword: data.keyword,
      });
    },
    readDirNames: async (e, path) => {
      const fs = require("fs");
      const dirNames = fs.readdirSync(path);
      return dirNames;
    },
    stop: async (e, name) => {
      await global.clearBrowser(name);
    },
  };

  Object.keys(handles).forEach((key) => {
    ipcMain.handle(key, handles[key]);
  });
};
