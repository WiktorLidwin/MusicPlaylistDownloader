const {
    finished
} = require('stream')
const {
    createContext
} = require('vm')

const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    YTSong = require('./YTSong.js'),
    SpotifySong = require('./SpotifySong.js'),
    ytdl = require('ytdl-core'),
    ffmpegPath = require('@ffmpeg-installer/ffmpeg').path,
    ffmpeg = require('fluent-ffmpeg'),
    ss = require('socket.io-stream'),
    dateTime = require('node-datetime'),
    fs = require('fs')

currentSongsDownloading = 0;
ffmpeg.setFfmpegPath(ffmpegPath);
app.use('/', express.static(__dirname + '/public'))
var PORT = 8080
server.listen(PORT)
console.log("listening on " + PORT + "...")

io.sockets.on('connection', socket => {
    console.log("connected")
    socket.on("requestPlaylistInfo", (type, url) => {
        console.log("getting " + type + " playlist with url: " + url)
        if (type == "youtube") {
            YTSong.getPlaylistInfo(url).then( val =>{
                socket.emit("YoutubePlaylistInfo",val, null)
            }).catch(err =>{
                socket.emit("YoutubePlaylistInfo",null, err)
            }) 
        }
        else if (type == "spotifyLink") {
            console.log("spotifyLink")
            SpotifySong.getPlaylistWithLink(url).then((val) =>{
                promises  = []
                Songs = []
                val.forEach(song =>{
                    promises.push(YTSong.search(song.name+" by "+song.artists, 1)) 
                })
                Promise.all(promises).then(Songs => {
                    // Songs = Songs.map(song => song[0]);
                    console.log("SENT!!!!!")
                    // for (let i = 0; i < Songs.length; i++) {
                    //     Songs[i] = Songs[i][0]
                    // }
                    // socket.emit("test",Songs)
                    socket.emit("SpotifyLinkPlaylistInfo", Songs, null)
                 }).catch(err =>{ console.log("Prtomis all errpr "+ err) });
            }).catch(err =>{
                console.log(err)
                socket.emit("SpotifyLinkPlaylistInfo",null,err)
            })
        }else{
            console.log("error!")
        }
        // socket.emit("requestPlaylist", data, error)
    })

    socket.on("searchForUsername", (type, userName)=>{
        if (type == "spotifyUsername") {
            console.log("spotifyUsername")
            SpotifySong.getUsernamePlaylists(userName).then((val) =>{
                socket.emit("searchForUsername",val,null)
            }).catch(err =>{
                socket.emit("searchForUsername",null,err)
            })
        }else{
            console.log("error!")
        }
    })

    socket.on("searchSong", (type, data)=>{
        console.log("type: "+type+" data:"+data)
        if(type == "Spotify"){
            console.log("SpotifySong")
            SpotifySong.getSongInfo(data).then((song)=>{
                console.log(song)
                YTSong.search(song.name+" by "+song.artists, 3).then((val)=>{
                    socket.emit("searchSong", val)  
                  })
            })
        }else if(type == "Youtube"){
            console.log("YoutubeSong")
            YTSong.getSongInfo(data).then((val)=>{
                socket.emit("searchSong", [val])  
            })
        }else if(type == "None"){
            console.log("NoneSong")
            YTSong.search(data, 3).then((val)=>{
              socket.emit("searchSong", val)  
            })
        }
    })
    socket.on("downloadSongs", (songArray,quality)=>{//TODO Manage downloads 
        console.log(songArray)
        for (let i = 0; i < songArray.length; i++) {
            streamSong(songArray[i],socket, quality)
        }
    })
    socket.on("retrySongs",failedSongs=>{
        promises  = []
        Songs = []
        failedSongs.forEach(song =>{
            promises.push(YTSong.search(song, 1)) 
        })
        Promise.all(promises).then(Songs => {
            // Songs = Songs.map(song => song[0]);
            console.log("SENT!!!!!")
            // for (let i = 0; i < Songs.length; i++) {
            //     Songs[i] = Songs[i][0]
            // }
            // socket.emit("test",Songs)
            socket.emit("SpotifyLinkPlaylistInfo", Songs, null)
        }).catch(err =>{ console.log("Prtomis all errpr "+ err) });
    })
    socket.on("logBug", bugtext=>{
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');   
        fs.appendFile('bugs.txt', formatted + " "+bugtext+"\n", function (err) {
            
          });
    })
})
function streamSong(videoId, socket,quality){
    
    if(quality =="Max"){
        quality = "highestaudio"
    }else if(quality =="Min"){
        quality = "lowestaudio"
    }else{
        quality = "lowestaudio"
    }
    currentSongsDownloading++;
    var stream = ytdl(videoId, {
        quality: quality,
    });
    stream.on('progress', function (_, downloaded, total) {
        socket.emit('downloadInfo', downloaded / total, videoId);
    });
    socketStream = ss.createStream();
    ss(socket).emit('file', socketStream, videoId);
    ffmpeg(stream)
                .audioBitrate(quality == "highestaudio"? 128:96)
                .format('mp3')
                .on('error', function (err) {
                var info = err.message;
                console.log(info)
                })
                .on('end', function () {
                currentSongsDownloading--;
                }).writeToStream(socketStream);
}