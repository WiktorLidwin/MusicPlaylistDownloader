const fs = require('fs')
const axios = require('axios');
  
const querystring = require('querystring')

const promiseTimeout = (ms, promise) => {
    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.')
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}



// url = "https://www.youtube.com/watch?v=0arvEmH88rU"
baseSearchURL = "https://www.youtube.com/results?search_query="
const getSongInfo = (url) => {
    return axios.get(url)
        .then(response => {
            str = response.data

            id = url.split('=')[1]

            TitleRegex = /\\"title\\":\\"(.*?)\\"/;
            title = str.match(TitleRegex)[1]
            // console.log(title)

            AuthorRegex = /\\"author\\":\\"(.*?)\\"/;
            author = str.match(AuthorRegex)[1]
            // console.log(author)

            LengthRegex = /\\"lengthSeconds\\":\\"(.*?)\\"/;
            length = str.match(LengthRegex)[1]
            // console.log(length)

            song = {
                "author": (author),
                "title": (title),
                "length": (length),
                "id": id
            }
            return song
        })
        .catch(error => {
            return error
        });

}
previousSongTitle = "";
previousSongAuthor = "";
previousSongLength = "";
const getPlaylistInfo = (url) => {

    songs = []
    indexMatchRegex = /index=(.*?)\".*?videoId\":\"(.*?)\".*?title.*?label\":\"(.+?)\"}}/gm;
    index = 1

    firstSongRegex = /videoId.*?label\":\"(.*?)\"}}/
    return axios.get(url)
        .then(response => {
            str = response.data

            fs.writeFile('output420', str, (err) => {
                //             // In case of a error throw err. 
                if (err) throw err;
            })

            match = str.match(firstSongRegex);
            makeSongInfo("", match[1], true)

            const matches = str.matchAll(indexMatchRegex);

            for (const match of matches) {
                if (index == match[1]) {
                    index++;
                    makeSongInfo(match[2], match[3])
                }
            }
            // fs.writeFile('kek21.json', jsonStr, (err) => {
            //     //             // In case of a error throw err. 
            //     //             if (err) throw err;
            // })
            return songs;
        })
        .catch(error => {
            return error
        });


}

function makeSongInfo(match2, match3, firstSong = false) {
    // if(match3.includes("ago")) //TODO bruh checj this shgit
    //     labelRegex = /(.*)by(.*?)\d+ \w+ ago (.+)/;
    // else 
    // labelRegex = /(.*)by(.*)(\d.+\d.+)/;
    labelRegex = /(?<title>.*)by(?<author>.*?)(\d+ \w+ ago (?<len1>.+)|(?<len2>\d.+\d.+))/;
    if (!firstSong) {
        song = {
            "author": previousSongAuthor,
            "title": previousSongTitle,
            "length": previousSongLength,
            "id": match2
        }
        songs.push(song)
    }
    deepCopy = (' ' + match3).slice(1);
    labelMatch = deepCopy.match(labelRegex);
    try {
        previousSongTitle = labelMatch.groups["title"];
        previousSongAuthor = labelMatch.groups["author"];
        if (labelMatch.groups["len1"] != undefined)
            previousSongLength = textToSeconds(labelMatch.groups["len1"]);
        else
            previousSongLength = textToSeconds(labelMatch.groups["len2"]);
    } catch (err) {}
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

const search = (SongName, results = 1) => {
    url = baseSearchURL +encodeURI(SongName)
    console.log(url)
    return axios.get(url).then(response => {
        // ms = 25000;
        // let id = setTimeout(() => {
        //     clearTimeout(id);
        //     return ('Timed out in ' + ms + 'ms.')
        // }, ms)
        // console.log(response)
        // str = response.data.split("ADDED_TO_QUEUE")[1]
        str = response.data
        fs.writeFile('searchTest.txt', response.data, (err) => {
            //             // In case of a error throw err. 
            //             if (err) throw err;
        })
        searchRegex = /videoId":"(?<ID>[A-z0-9]{11})","thumbnail".*?title".*?label":"(?<Label>.*?[^\\])".*?lengthText":{"accessibility":.*?label":"(?<len>.*?)"/gm
        matches = str.matchAll(searchRegex);
        songs = [];
        for (const match of matches) {
            try {
                if (results == 0) {
                    return (songs.length == 1? songs[0]:songs);
                }
                results--;
                // console.log(match.groups["ID"])
                labelRegex = /(?<title>.*) by (?<author>.*?) (\d+ \w+ ago (?<len>.*?))[\d,]* views/;
                SecondartLabelRegex = /(?<title>.*) by (?<author>.*?) (?<len>[\d]+ [a-z]*?,.*?)[\d,]* views/;

                // fs.writeFile('matchTest.txt', match, (err) => {
                //     //             // In case of a error throw err. 
                //     //             if (err) throw err;
                // })
                labelMatch = match.groups["Label"].match(labelRegex);
                if (labelMatch == null) {
                    labelMatch= match.groups["Label"].match(SecondartLabelRegex);
                    song = {
                        "author": (labelMatch.groups["author"]),
                        "title": (labelMatch.groups["title"]),
                        "length": (textToSeconds(match.groups["len"])),
                        "id": match.groups["ID"]
                    }
                    songs.push(song)
                } else {
                    song = {
                        "author": (labelMatch.groups["author"]),
                        "title": (labelMatch.groups["title"]),
                        "length": (textToSeconds(match.groups["len"])),
                        "id": match.groups["ID"]
                    }

                    songs.push(song)
                }
            } catch (err) {
                console.log("YTSONGS Inner ERROR: " + err+"   SongName:"+SongName)
                return {"type":"YTSONGS Inner ERROR", "error": err, "SongName":SongName}
            }
        }
    }).catch(error => {
        console.log("YTSONGS ERROR: " + error+"   SongName:"+SongName)
        return {"type":"YTSONGS ERROR", "error": error, "SongName":SongName}
    });
    // return promiseTimeout(axiosPromise, 4000);
}



// url = "https://www.youtube.com/watch?v=Dboi1bja6M8"
// console.log(
//     getSongInfo(url).then(val =>{
//         console.log(val)
//     }))
// url = "https://www.youtube.com/playlist?list=PLLvZ8AFk6bnlE9Gi6M7ksLNWbZ2aohJ-a"

// console.log(
//     getPlaylistInfo(url).then(val => {
//         console.log(val)
//         fs.writeFile('kek2.json', val, (err) => {
//             // In case of a error throw err. 
//             if (err) throw err;
//         })
//     }))
// search("Moves by Big Sean", 3).then(val => {
//     console.log(val)
// })
exports.getSongInfo = getSongInfo;
exports.getPlaylistInfo = getPlaylistInfo;
exports.search = search;