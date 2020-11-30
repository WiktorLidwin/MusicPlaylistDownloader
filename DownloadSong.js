const fs = require('fs');
const ytdl = require('ytdl-core');
const readline = require('readline');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const ss = require('socket.io-stream');
id = "no1YszVVybo"

// async function download(){
//     let info = await ytdl.getInfo(videoID);
//     let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
//     console.log('Formats with only audio: ' + audioFormats.length);
//     console.log(audioFormats)
// }
// download()

let stream = ytdl(id, {
    quality: 'highestaudio',
  });
  stream.on('progress', function (l, c, t) {
    readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${c/t*100}%`);
  })
  let start = Date.now();
  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${__dirname}/${id}.mp3`)
    .on('progress', (p,c,t) => {
    //   readline.cursorTo(process.stdout, 0);
    //   process.stdout.write(`${p.targetSize}kb downloaded ${c}${t}%`);
    })
    .on('end', () => {
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
});