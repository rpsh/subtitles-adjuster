## subtitles-adjuster
Auto adjust the timeline of bilingual subtitles with the base subtitles (eg: English version subtitle).
自动根据基准字幕（一般是视频自带的英文字幕）校准双语字幕的时间轴。

## Install

```
npm install -g subtitles-adjuster
```

## Usage
```
subtitles-adjuster -b=en.srt -d=en_chs.srt
```
Options:

| Option         | Required | Default     |
|----------------|----------|-------------|
| --base or -b  | Yes      |             |
| --draft or -d  | Yes      |             |
| --output or -o | No       | fixed.srt 	|
| --baseEncode		| No       | // auto detect	|
| --draftEncode		| No       | // auto detect	|


## Supported file types
* input: `.ass, .srt`
* output: `.srt`


## How to get base subtitles

1. Install [ffmpeg](https://www.ffmpeg.org/download.html)
2. Extract subtitle from video file
	```
	ffmpeg -i video.mkv base.srt
	```
3. You will get the base subtitles: base.srt

## License
MIT
