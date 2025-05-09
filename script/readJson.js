const fs = require("fs");

const readJson = (path) => {
  let profileData = {};
  if (fs.existsSync(path)) {
    profileData = JSON.parse(fs.readFileSync(path, "utf-8"));
  }
  return profileData;
};

module.exports = readJson;
