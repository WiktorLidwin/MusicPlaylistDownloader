fs = require('fs');
fs.readFile("output420", 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    data1 = data
    previousSongTitle = "";
    previousSongAuthor = "";
    previousSongLength = "";
    songs = []
    str = data1
    indexMatchRegex = /index=(.*?)\".*?videoId\":\"(.*?)\".*?title.*?label\":\"(.+?)\"}}/gm;
    index = 1
    
    firstSongRegex = /videoId.*?label\":\"(.*?)\"}}/


    match = str.match(firstSongRegex);
    makeSongInfo("", match[1], true)

    const matches = str.matchAll(indexMatchRegex);

    for (const match of matches) {
        if (index == match[1]) {
            index++;
            makeSongInfo(match[2], match[3])
        }
    }

    jsonStr = JSON.stringify(songs);
    fs.writeFile('kek2.json', jsonStr, (err) => {
        // In case of a error throw err. 
        if (err) throw err;
    })
});

function makeSongInfo(match2, match3, firstSong = false) {
    // labelRegex = /(.*)by(.*?)\d+ \w+ ago (.+)/;//TODO wtf why does this swpa???
    labelRegex = /(?<title>.*)by(?<author>.*?)(\d+ \w+ ago (?<len1>.+)|(?<len2>\d.+\d.+))/;
    
    if (!firstSong) {
        song = {
            "author": previousSongAuthor,
            "title": previousSongTitle,
            "length": previousSongLength,
            "id": match2
        }
        songs.push(song)
    }else{
        console.log(match2,match3)
    }
    deepCopy = (' ' + match3).slice(1);
    console.log(deepCopy)
    labelMatch = deepCopy.match(labelRegex);
    console.log("here:" +labelMatch.length)
    console.log(labelMatch)
    console.log(labelMatch.groups["title"])
    
    try {
        previousSongTitle = labelMatch[1];
        previousSongAuthor = labelMatch[2];
        previousSongLength = textToSeconds(labelMatch[3]);
    } catch (err) {
        console.log("error")
    }
}

function textToSeconds(text) {
    seconds = 0;
    index1 = 0;
    if (text.includes("hour")) {
        seconds += parseInt(text.split(", ")[index1].split(" ")[0]) * 3600
        index1++;
    }
    if (text.includes("minute")) {
        seconds += parseInt(text.split(", ")[index1].split(" ")[0]) * 60
        index1++;
    }
    if (text.includes("second")) {
        seconds += parseInt(text.split(", ")[index1].split(" ")[0])
    }
    return seconds
}