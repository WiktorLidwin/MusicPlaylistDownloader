const {spawn} = require('child_process'),
                path = require('path') 

/**
 * Run python script, pass in `-u` to not buffer console output
 * @return {ChildProcess}
 */
function runScript(file, params) {
    temp = [
        "-u",
        path.join(__dirname, file)
    ]
    temp = temp.concat(params)
    //console.log(temp)
    return spawn('python', temp);
}

function callPython(file, params, _callback = null, callbackparams = null) {
    return new Promise((resolve, reject)=>{
        var subprocess = runScript(file, params);
        var Data = ""
        subprocess.stdout.on('data', function (data) {
            Data += data.toString()
            // return (returndata(data.toString(), _callback, callbackparams))
        });
        subprocess.stderr.on('error', function (data) {
            reject()
        });
        subprocess.on('close', function () {
            // console.log("close");
            resolve(JSON.parse(Data))
        });
    })
    
}

const getUsernamePlaylists = (username) => {
    return  (callPython("scripts/GetSpotifyPlaylistWithUsername.py",[username]))
}
const getPlaylistWithLink = (url) => {
    return  (callPython("scripts/GetSpotifyPlaylistWithLink.py",[url]))
}

const getSongInfo = (url)=>{
    return (callPython("scripts/GetSpotifySongWithLink.py",[url]))
}
// getUsernamePlaylists("wiktortheboss").then((val) =>{
//     console.log(val)
//     console.log(val[0])
// })

// getPlaylistWithLink("https://open.spotify.com/playlist/6CMnEi67DPsYuReC2L8Br6?si=XFMeY2LuR6u_WZqoOVbkoA").then((val) =>{
//     console.log(val)
// })
// getPlaylistWithLink("spotify:playlist:6mRtagKEmjl7qVApy6ogRW").then((val) =>{
//     console.log(val)
// })
// getSongInfo("https://open.spotify.com/track/0HMCdlOPJkAGlB0MlSWIcO?si=U6TtWhUcTe2cZXDx0BGjKg").then((val) =>{
//   console.log(val)  
// })
exports.getUsernamePlaylists = getUsernamePlaylists;
exports.getPlaylistWithLink = getPlaylistWithLink;
exports.getSongInfo = getSongInfo