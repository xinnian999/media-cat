const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const readJson = require("./readJson");

const writeJson = (filePath, setData) => {
  const userDataDir = app.getPath("userData"); // 安全可写

  const profilePath = path.join(userDataDir, filePath);

  const sourceData = readJson(filePath);

  const newData = setData(sourceData);

  fs.writeFileSync(profilePath, JSON.stringify(newData, null, 2));
};

module.exports = writeJson;
