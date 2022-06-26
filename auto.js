/*
 * @Author: rpsh
 * @Date: 2022-06-26 16:31:37
 * @LastEditors: rpsh myrpsh@gmail.com
 * @LastEditTime: 2022-06-26 23:57:55
 * @FilePath: /subtitles-adjuster/auto.js
 * @Description: 自动处理文件夹内的字幕校准
 */
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const dir = 'subs/s03';
const enDir = dir + '/en';
const zhDir = dir + '/zh';
const enFiles = getFiles(enDir);
const zhFiles = getFiles(zhDir);

const priority = [
  /.srt$/i,
  /(简体 双语|简体&英文|中英双语|简体双语|简体中英)/i,
];

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  let result = [];
  files.forEach((file) => {
    if (fs.lstatSync(path.join(dir, file)).isFile()) {
      result.push(path.join(dir, file));
    } else if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
      result = [...result, ...getFiles(path.join(dir, file))];
    }
  });
  return result;
}

function adjustSrt(enFiles, zhFiles) {
  enFiles.forEach((enFile) => {
    const zhFile = zhFiles.find((item) => {
      const enEpisode = enFile
        .split('/')
        [enFile.split('/').length - 1].match(/S\d\d+E\d\d+/g)[0];
      const zhEpisode = item.split('/')[item.split('/').length - 1];
      const filters = priority.concat(new RegExp(enEpisode));
      return filters.every((filter) => {
        return filter.test(zhEpisode);
      });
    });

    if (zhFile) {
      execFile('node', [
        './bin/index.js',
        '-b',
        enFile,
        '-d',
        zhFile,
        '-o',
        `${dir}/fixed/${enFile
          .split('/')
          [enFile.split('/').length - 1].replace('.en.srt', '.srt')}`,
      ]);
    }
  });
}

adjustSrt(enFiles, zhFiles);
