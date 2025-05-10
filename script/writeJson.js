const fs = require("fs");
const path = require("path");

const writeJson = (filePath, data) => {
  fs.writeFileSync(
    path.resolve(process.cwd(), filePath),
    JSON.stringify(data, null, 2)
  );
};

module.exports = writeJson;
