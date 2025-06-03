const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

/**
 * 将图片文件同步转换为 Base64 Data URL
 * @param {string} imagePath - 图片文件的绝对路径
 * @returns {string} Data URL 字符串
 * @throws {Error} 如果文件不存在或读取失败时抛出错误
 */
function imageToBase64Sync(imagePath) {
  // 验证文件是否存在
  if (!fs.existsSync(imagePath)) {
    throw new Error(`图片文件不存在: ${imagePath}`);
  }
  
  // 获取文件扩展名
  const extension = path.extname(imagePath).toLowerCase();
  
  // 确定 MIME 类型
  let mimeType = mime.lookup(extension);
  if (!mimeType) {
    // 常见图片类型的回退
    const fallbackMimes = {
      '.ico': 'image/x-icon',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp'
    };
    mimeType = fallbackMimes[extension] || 'application/octet-stream';
  }
  
  // 读取文件并转换为 Base64
  const buffer = fs.readFileSync(imagePath);
  const base64Data = buffer.toString('base64');
  
  // 构建 Data URL
  return `data:${mimeType};base64,${base64Data}`;
}

// 导出函数
module.exports = imageToBase64Sync;