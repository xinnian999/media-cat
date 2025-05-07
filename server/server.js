const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// 配置 multer：上传到 uploads/ 目录
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// 1. 映射根路径为 index.html
app.use(express.static(path.join(__dirname, 'public')));

// 2. 上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.send(`File uploaded: ${req.file.filename}`);
});

// 创建 uploads 目录（如果不存在）
const fs = require('fs');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
