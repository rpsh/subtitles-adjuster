/*
 * @Author: rpsh
 * @Date: 2022-06-26 16:31:37
 * @LastEditors: rpsh
 * @LastEditTime: 2023-03-09 00:04:19
 * @FilePath: /subtitles-adjuster/adjust-two-file.js
 * @Description: 自动处理文件夹内的字幕校准
 */
const fs = require('fs');
const path = require('path');
const { parseSubtitle, convertToSubtitle } = require('./utils/parse-subtitle');

const dir = 'subs/two';

const priority = [
  /.srt$/i,
  /(简体 双语|简体&英文|中英双语|简体双语|简体中英|zh-Hant|zh-cn|cn)/i,
];

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  const enFiles = [];
  const zhFiles = [];
  files.forEach((file) => {
    if (
      fs.lstatSync(path.join(dir, file)).isFile() &&
      /\.en\.srt$/i.test(file)
    ) {
      enFiles.push(path.join(dir, file));
    }
    if (
      fs.lstatSync(path.join(dir, file)).isFile() &&
      /\.(zh-cn|cn|zh|zh-hant)\.srt$/i.test(file)
    ) {
      zhFiles.push(path.join(dir, file));
    }
  });

  console.log(enFiles, zhFiles);

  const result = [];
  enFiles.forEach((enFile) => {
    const zhFile = zhFiles.find((item) => {
      const fileName = enFile.replace(/\.en\.srt$/i, '');
      const reg = new RegExp(fileName, 'i');
      if (reg.test(item)) {
        return item;
      }
    });
    if (zhFile) {
      result.push({
        en: enFile,
        zh: zhFile,
      });
    }
  });

  return result;
}

// 对齐时间轴
function subtitlesAdjuster(options) {
  const { base, draft } = options;
  const baseSubtitles = parseSubtitle(base); // 基准字幕
  const draftSubtitles = parseSubtitle(draft); // 待调整时间轴的字幕

  draftSubtitles.forEach((item, index) => {
    if (baseSubtitles[index]) {
      item.startTime = baseSubtitles[index].startTime;
      item.endTime = baseSubtitles[index].endTime;
    }
  });

  return convertToSubtitle({
    data: draftSubtitles,
  });
}

// 开始处理
function adjustSrt(dir) {
  const files = getFiles(dir);
  for (let i = 0; i < files.length; i++) {
    const { en, zh } = files[i];
    const base = fs.readFileSync(en, 'utf-8');
    const draft = fs.readFileSync(zh, 'utf-8');

    const result = subtitlesAdjuster({ base, draft });
    fs.writeFileSync(zh.replace('.srt', '-fixed.srt'), result);
  }
}

adjustSrt(dir);
