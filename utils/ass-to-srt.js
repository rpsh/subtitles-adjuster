/*
 * @Author: rpsh myrpsh@gmail.com
 * @Date: 2022-06-20 23:02:14
 * @LastEditors: rpsh myrpsh@gmail.com
 * @LastEditTime: 2022-06-26 23:56:43
 * @FilePath: /subtitles-adjuster/ass-to-srt.js
 * @Description: ass字幕转srt字幕
 */
const assToSrt = require('ass-to-srt');
const srtParser = require('./srt-parser');
const checkBlacklist = require('./check-blacklist');

function ass2srt(data) {
  const srt = assToSrt(data);
  const subtitles = srtParser.fromSrt(srt);
  const result = [];

  let i = 1;

  subtitles.forEach((item) => {
    if (checkBlacklist(item.text) || !item.text) {
      return true;
    }
    result.push({
      ...item,
      id: `${i}`,
    });
    i++;
  });

  return srtParser.toSrt(result);
}

module.exports = ass2srt;
