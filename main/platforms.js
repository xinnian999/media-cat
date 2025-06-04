const path = require("path");
const imageToBase64Sync = require("@/utils/imageToBase64Sync");

const list = [
  {
    label: "抖音",
    icon: imageToBase64Sync(path.join(__dirname, "assets/douyin.ico")),
    platform: "douyin",
    url: "https://creator.douyin.com/",
  },
  {
    label: "快手",
    icon: imageToBase64Sync(path.join(__dirname, "assets/kuaishou.ico")),
    platform: "kuaishou",
    url: "https://creator.kuaishou.com/",
  },
  {
    label: "小红书",
    icon: imageToBase64Sync(path.join(__dirname, "assets/xiaohongshu.ico")),
    platform: "xiaohongshu",
    url: "https://creator.xiaohongshu.com/",
  },
  {
    label: "视频号",
    icon: imageToBase64Sync(path.join(__dirname, "assets/shipinhao.ico")),
    platform: "shipinhao",
    url: "https://channels.weixin.qq.com/",
  },
  {
    label: "B站",
    icon: imageToBase64Sync(path.join(__dirname, "assets/bilibili.ico")),
    platform: "bilibili",
    url: "https://member.bilibili.com",
  },
];

module.exports = {
  list,
  map: list.reduce((acc, item) => {
    acc[item.platform] = item;
    return acc;
  }, {}),
};
