const express = require("express");
const multer = require("multer");
const path = require("path");

function createServer({ port = 3000, info, setInfo } = {}) {
  return new Promise((resolve, reject) => {
    const app = express();

    // 确保 uploads 目录存在
    const uploadsDir = path.join(__dirname, "./public");

    // 配置 multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => cb(null, "demo.mp4"),
    });
    const upload = multer({ storage });

    // 静态资源映射
    app.use(express.static(path.join(__dirname, "public")));
    app.use("/uploads", express.static(uploadsDir));

    // 上传接口
    app.post("/upload", upload.single("file"), (req, res) => {
      if (!req.file) return res.status(400).send("No file uploaded.");

      setInfo(req.body);

      Object.keys(req.body).forEach((key) => {
        if (key === "imitate") {
          setInfo({ imitate: req.body[key] === "on" });
        }

        if (key.includes("tag")) {
          setInfo({ tags: [...info.tags, req.body[key]] });
        }
      });

      res.send(`
        <h1>确认信息</h1>
        <p>文件名: ${req.file.filename}</p>
        <p>文件大小: ${req.file.size}</p>
        <p>文件类型: ${req.file.mimetype}</p>
        <p>标题: ${req.body.title}</p>
        <p>描述: ${req.body.desc}</p>
        <p>模拟流程: ${req.body.imitate}</p>
      `);
    });

    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      resolve({ app, server }); // 关键点：监听成功后再 resolve
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = createServer;
