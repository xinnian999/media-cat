const { dialog, ipcMain, app } = require("electron");

const readJson = require("@/utils/readJson");

const writeJson = require("@/utils/writeJson");

const log = require("@/utils/log");

const { randomUUID } = require("crypto");

const dayjs = require("dayjs");

const platforms = require("@/platforms");

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
    bindAccount: require("@/script/bindAccout"),
    profile: () => {
      return readJson("cache/profile.json");
    },
    updateProfile: require("@/script/updateProfile"),
    downloadVideo: require("@/script/tool/downloadVideo"),
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
      const addDyAuther = require("@/script/tool/addDyAuther");
      return await addDyAuther({
        autherUrl,
        addBrowser: (browser) => {
          browsers.push(browser);
        },
      });
    },
    updateDyAuther: async (e, autherUrl) => {
      const updateDyAuther = require("@/script/tool/updateDyAuther");
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
      const findHttp = require("@/script/tool/findHttp");
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
      console.log(name);
      await global.removeBrowser(name);
    },
    goCreateCenter: require("@/script/goCreateCenter"),
    platformList: () => platforms.list,
    platformMap: () => platforms.map,
    publish: require("@/script/publish"),
    publishLog: () => {
      return readJson("cache/publishLog.json");
    },
    addPublishLog: (e, data) => {
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
    },
  };

  Object.keys(handles).forEach((key) => {
    ipcMain.handle(key, handles[key]);
  });
};
