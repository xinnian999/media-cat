const writeJson = require("@/utils/writeJson");

module.exports = (data) => {
  writeJson("./publish-log.json", (data) => {
    return [...data, data];
  });
};
