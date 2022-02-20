#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');

const ass2srt = require('../ass-to-srt');
const subtitlesAdjuster = require('../index');

const argv = yargs.argv;

const baseFileName = path.resolve(argv.b || argv.base);
const baseFileEncode = argv.e || argv.baseEncode;
const draftFileName = path.resolve(argv.d || argv.draft);
const draftFileEncode = argv.f || argv.draftEncode;
const outputFilename = path.resolve(
  argv.o || argv.output || `${(draftFileName || '').replace(/\.(srt|ass)$/, '.fixed.srt')}`,
);

const supportExtname = ['.ass', '.srt'];
const baseExtname = path.extname(baseFileName);
const draftExtname = path.extname(draftFileName);

const unsuportFiles = getUnsupportFiles(baseExtname, draftExtname);

if (!baseFileName) {
  throw new Error('[Error] Base subtitle filename is required. Please use the -b or --base flag');
}

if (!draftFileName) {
  throw new Error('[Error] Draft subtitle filename is required. Please use the -b or --draft flag');
}

if (unsuportFiles.length) {
  throwError(
    `[Error]
* Currently supported input file types （当前支持的字幕格式）: .ass, .srt

Not Support （不支持的文件）:
${unsuportFiles.join('\n')}`,
  );
}

const baseFile = fs.readFileSync(baseFileName);
const draftFile = fs.readFileSync(draftFileName);

let baseSubtitle = iconv.decode(
  baseFile,
  baseFileEncode || jschardet.detect(baseFile).encoding || 'utf8',
);
let draftSubtitle = iconv.decode(
  draftFile,
  draftFileEncode || jschardet.detect(draftFile).encoding || 'utf8',
);

if (baseExtname === '.ass') {
  baseSubtitle = ass2srt(baseSubtitle);
}

if (draftExtname === '.ass') {
  draftSubtitle = ass2srt(draftSubtitle);
}

const outputFile = subtitlesAdjuster({
  base: baseSubtitle,
  draft: draftSubtitle,
});

if (outputFile) {
  fs.writeFileSync(path.resolve(outputFilename), outputFile, 'utf8');
  log(`Completed（字幕校正完成）：
${outputFilename}`);
}

function throwError(message) {
  throw new Error(log(message, 'error'));
}

function log(message, type = 'log') {
  const colors = {
    // https://bluesock.org/~willkg/dev/ansi.html
    error: '31',
    log: '32',
  };
  console.log(`\x1b[${colors[type]}m%s\x1b[0m`, message);
}

function getUnsupportFiles(baseExtname, draftExtname) {
  const result = [];
  if (!~supportExtname.indexOf(baseExtname)) {
    result.push(baseFileName);
  }
  if (!~supportExtname.indexOf(draftExtname)) {
    result.push(draftFileName);
  }
  return result;
}
