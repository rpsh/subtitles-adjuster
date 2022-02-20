const { SubtitleTime } = require('subtitle-time');
const { default: stringSimilarity } = require('string-similarity-js');

const srtParser = require('./srt-parser');

// 校准字幕
function subtitlesAdjuster(options) {
  const { base, draft } = options;
  const baseSubtitles = parseSubtitle(base); // 基准字幕
  const draftSubtitles = parseSubtitle(draft); // 待调整时间轴的字幕

  let j = 0; // 基准字幕的 index
  let lag = 0; // 记录两个字幕之间的时间差距，当两个字幕不能匹配时候，使用这个 lag 自动调整时间

  draftSubtitles.forEach((item, index) => {
    const matches = item.text.split(/\n/); // 将字幕通过分行符拆分成数组

    // 如果只有一行字幕，就跳过匹配过程，默认认为这行字幕是仅中文的
    if (matches && matches.length > 1) {
      // 在基准字幕中找到同一条字幕的 index
      const i = findSimilarSubtitle({
        text: matches[matches.length - 1],
        baseSubtitles,
        index: j,
      });

      if (i !== null) {
        // 先记录下来时间差，以备后续使用
        lag = clacTimeLag(baseSubtitles[i].startTime, item.startTime);

        item.startTime = baseSubtitles[i].startTime;
        item.endTime = baseSubtitles[i].endTime;

        // 移动基准字幕的 index 到下一个
        j = i + 1;
      } else {
        // 推测调整没找到匹配字幕的时间偏移
        item.startTime = adjustTime(item.startTime, lag);
        item.endTime = adjustTime(item.endTime, lag);
      }
    } else {
      // 调整仅中文字幕的时间偏移
      item.startTime = adjustTime(item.startTime, lag);
      item.endTime = adjustTime(item.endTime, lag);
    }
  });

  return convertToSubtitle({
    data: draftSubtitles,
  });
}

// 寻找相似的字幕
function findSimilarSubtitle(options) {
  const { text, baseSubtitles, index = 0, counter = 0 } = options;

  // 超过字幕条数，或者，查找超过50条后，则认为没有相似的字幕
  if (index >= baseSubtitles.length || counter > 50) {
    return null;
  }

  // 相似度超过 0.9 的即认为是同一条
  if (stringSimilarity(text, baseSubtitles[index].text.replace(/\n/g, ' ')) >= 0.9) {
    return index;
  } else {
    return findSimilarSubtitle({
      ...options,
      index: index + 1,
      counter: counter + 1, //最多查找50条，如果没有找到相似的就跳出
    });
  }
}

// 计算字幕两个时间点间的时间差
function clacTimeLag(time1, time2) {
  return new SubtitleTime(time1, 'srt').to('second') - new SubtitleTime(time2, 'srt').to('second');
}

// 调整时间
function adjustTime(time, lag) {
  return new SubtitleTime(new SubtitleTime(time, 'srt').to('second') + lag, 'second').to('srt');
}

// 转为 srt 文件
function convertToSubtitle(options) {
  const { data = [] } = options;
  return srtParser.toSrt(data);
}

// 解析字幕文件
function parseSubtitle(file) {
  return srtParser.fromSrt(file);
}

module.exports = subtitlesAdjuster;
