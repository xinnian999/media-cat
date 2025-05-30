const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const readJson = (filePath) => {
  const userDataDir = app.getPath("userData"); // 安全可写
  const profilePath = path.join(userDataDir, filePath);

  let profileData = {};

  if (fs.existsSync(profilePath)) {
    profileData = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  }

  return profileData;
};

module.exports = readJson;
