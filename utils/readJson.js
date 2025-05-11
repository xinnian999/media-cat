const fs = require("fs");
const path = require("path");

const readJson = (filePath) => {
  const profilePath = path.resolve(process.cwd(), filePath);

  let profileData = {};

  if (fs.existsSync(profilePath)) {
    profileData = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  }

  return profileData;
};

module.exports = readJson;
