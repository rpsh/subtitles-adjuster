/*
 * @Author: rpsh myrpsh@gmail.com
 * @Date: 2022-06-26 18:38:05
 * @LastEditors: rpsh myrpsh@gmail.com
 * @LastEditTime: 2022-06-27 00:00:18
 * @FilePath: /subtitles-adjuster/utils/check-blacklist.js
 * @Description: 检查是否过滤字幕
 */
const blacklist = [
  /^m\s[\d-\s]+/, // ass字幕的绘画指令
  '最新连载海外影视剧字幕下载', // 过滤掉宣传
  '关注新浪微博',
];

function checkBlacklist(text) {
  return blacklist.some((item) => {
    const reg = new RegExp(/\/.*\//.test(item) ? item : '^' + item, 'g');
    return reg.test(text.replace(/{\\[^}]*}/g, '').replace(/^\s+/, ''));
  });
}

module.exports = checkBlacklist;
