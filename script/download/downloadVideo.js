const fs = require("fs");
const https = require("https");

module.exports = async (url, outputPath) => {
  console.log(url);
  const options = new URL(url);

  options.headers = {
    Referer: url,
  };

  const file = fs.createWriteStream(outputPath);

  https
    .get(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ 请求失败，状态码: ${res.statusCode}`);
        return;
      }

      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("✅ 下载完成:", outputPath);
      });
    })
    .on("error", (err) => {
      fs.unlink(outputPath, () => {});
      console.error("❌ 下载出错:", err.message);
    });
};
