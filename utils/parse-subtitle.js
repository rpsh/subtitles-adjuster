/*
 * @Author: rpsh
 * @Date: 2023-03-08 23:31:38
 * @LastEditors: rpsh
 * @LastEditTime: 2023-03-08 23:40:53
 * @FilePath: /subtitles-adjuster/utils/parse-subtitle.js
 * @Description:
 */
const srtParser = require('./srt-parser');

// 解析字幕文件
function parseSubtitle(file) {
  const subtitles = srtParser.fromSrt(file);

  return subtitles;
}

// 转为 srt 文件
function convertToSubtitle(options) {
  const { data = [] } = options;
  return srtParser.toSrt(data);
}

module.exports = { parseSubtitle, convertToSubtitle };
