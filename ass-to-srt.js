const assToSrt = require('ass-to-srt');
const srtParser = require('./srt-parser');

// 字幕中要过滤掉的条目
const filters = [
  /^m\s[\d-\s]+/, // ass字幕的绘画指令
  '最新连载海外影视剧字幕下载', // 过滤掉宣传
  // '原创翻译',
];

function ass2srt(data) {
  const srt = assToSrt(data);
  const subtitles = srtParser.fromSrt(srt);
  const result = [];

  let i = 1;

  subtitles.forEach((item) => {
    if (checkFilters(item.text)) {
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

function checkFilters(text) {
  return filters.some((item) => {
    const reg = new RegExp(/\/.*\//.test(item) ? item : '^' + item, 'g');
    return reg.test(text);
  });
}

module.exports = ass2srt;
