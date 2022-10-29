/*
 * @Author: rpsh myrpsh@gmail.com
 * @Date: 2022-06-26 18:38:05
 * @LastEditors: rpsh
 * @LastEditTime: 2022-08-17 23:05:32
 * @FilePath: /subtitles-adjuster/utils/check-blacklist.js
 * @Description: 检查是否过滤字幕
 */
const blacklist = [
  /^m\s[\d-\s]+/, // ass字幕的绘画指令
  '最新连载海外影视剧字幕下载', // 过滤掉宣传
  '关注新浪微博', // 过滤掉宣传
  '扫扫加微信',
  '字幕仅供学习',
  '倾情译制',
  '原创翻译',
  '字幕由SSK字幕组倾情译制',
  /(大家字幕组|SSK字幕组|星空字幕组|YYeTs|人人影视)/,
  /^(EVERYONE|■)$/,
  /^(翻译|时轴|压制|总监|校对|校对&监制|轴\&特效|官网|时间轴|轴|特效|后期|校对&总监)[\s｜：|:]/,
];

function checkBlacklist(text) {
  return blacklist.some((item) => {
    const reg = new RegExp(/\/.*\//.test(item) ? item : '^' + item, 'g');
    return reg.test(text.replace(/{\\[^}]*}/g, '').replace(/^\s+/, ''));
  });
}

module.exports = checkBlacklist;
