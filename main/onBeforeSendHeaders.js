const { session } = require("electron");


module.exports = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const { url } = details;
    if (url.includes("hdslb.com")) {
      details.requestHeaders["Referer"] = "https://www.bilibili.com"; // 兼容b站头像链接
    }
    callback({ requestHeaders: details.requestHeaders });
  });
};