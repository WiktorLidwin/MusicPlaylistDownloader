function addPlaylistBtnOnClick() {
    if (addPlaylistSubSector.style.display == "block") {
        addPlaylistSubSector.style.display = "none"
    } else {
        addPlaylistSubSector.style.display = "block"
    }
}

function platformBtnChanged() {
    // console.log("hello")
    platform = platformBtn.value;
    loadPlatformSector(platform);
    playlistURLTextOnInput()
}

function rotatePlatformSectionBtnOnClick() {
    if (platformSectionState == 0) {
        if (searchedForUser == 1)
            searchUserSector.style.display = "inline-block"
        else
            platformSectionState = 1;
        playlistURLText.pattern = ".+"
        playlistURLLabel.innerHTML = "Spotify Username"
        rotatePlatformSectionBtn.innerHTML = "URL"
        spotifyUserNameSearchBtn.style.display = "inline-block"
    } else if (platformSectionState == 1) {
        playlistURLText.pattern = "(https:\/\/open\.spotify\.com\/playlist\/[a-zA-z0-9=\+\-\?]+)"
        searchUserSector.style.display = "none"
        platformSectionState = 0;
        playlistURLLabel.innerHTML = "Spotify Playlist URL"
        rotatePlatformSectionBtn.innerHTML = "UserName Search"
        spotifyUserNameSearchBtn.style.display = "none"
    }
    playlistURLTextOnInput()
}

function loadPlatformSector(platform) {
    URLSector.style.display = "inline-block"
    loadPlaylistDataBtn.style.display = "inline-block"
    playlistURLLabel.style.display = "inline-block"
    playlistURLText.style.display = "inline-block"
    if (platform == 0) {
        //Spotify
        rotatePlatformSectionBtn.style.display = "inline-block"
        rotatePlatformSectionBtnOnClick()
    } else if (platform == 1) {
        platformSectionState = (platformSectionState === 0 ? 1 : 0)
        playlistURLText.pattern = "^.*(youtu.be\/|list=)([^#\&\?]*).*"
        searchUserSector.style.display = "none"
        rotatePlatformSectionBtn.style.display = "none"
        spotifyUserNameSearchBtn.style.display = "none"
        playlistURLLabel.innerHTML = "Youtube Playlist URL"
        //Youtube
    }
}
// data = [
//     ["Idk", "1"],
//     ["Nightcore", "2"],
//     ["Me and My Guitar", "3"]
// ]

function loadPlaylistDataBtnOnClick() {
    if (CurrentDelayBetweenPlaylistRequests == 0) {
        type = (platformBtn.value == 0 ? (platformSectionState == 0?"spotifyLink":"spotifyUsername") : "youtube")
        
        if(type=="spotifyUsername"){
            socket.emit("requestPlaylistInfo", "spotifyLink", playlistSelect.value)
        }else{
            socket.emit("requestPlaylistInfo", type, playlistURLText.value)
        }
        
        loadPlaylistDataBtn.classList.add("disabled")
    }
    else{
        var toastHTML = "Please wait "+CurrentDelayBetweenPlaylistRequests+" seconds!";
        M.toast({
            html: toastHTML,
            classes: 'toast rounded toast-container',
            inDuration: 100,
            outDuration: 200
        })
    }
    //socket.emit('get playlist) or something
}

function loadPlaylistsData(data,error){
    // console.log(data)
    // console.log("error")
    // console.log(error)
    if (error) {
        M.Toast.dismissAll();
        var toastHTML = 'Error! '+error;
        M.toast({
            html: toastHTML,
            classes: 'toast rounded toast-container',
            inDuration: 100,
            outDuration: 200
        })
    } else {
        // console.log(data)//TODO

    }
}





function resetPlaylistDelay(){
    CurrentDelayBetweenPlaylistRequests = DelayBetweenPlaylistRequests;
        interval = setInterval(()=>{
            if(CurrentDelayBetweenPlaylistRequests >0)
                CurrentDelayBetweenPlaylistRequests-=1;
            else{
                clearInterval(interval)
            }
        },1000)
}

function loadPlaylistData(data,error){
    // console.log(data)
    // console.log("error")
    // console.log(error)
    if (error) {
        M.Toast.dismissAll();
        var toastHTML = 'Error! '+error;
        M.toast({
            html: toastHTML,
            classes: 'toast rounded toast-container',
            inDuration: 100,
            outDuration: 200
        })
    } else {
        songdata = []
        failedSongs = [];
        let i = 0;
        for (i = 0; i < data.length; i++) {
            try{
                if(data[i]["error"] != undefined){
                    failedSongs.push(data[i]["SongName"])
                }
                else
                    songdata[i] = [data[i]["title"], data[i]["author"], data[i]["id"], data[i]["length"]]      
            }catch(Error){
                // console.log("Bruh")
                songdata[i] = null
            }
            // songdata[i] = new song()
        }
        // console.log("failed songs"+failedSongs)
        if(failedSongs.length != 0){
            M.Toast.dismissAll();
            M.toast({
                html: '<span>Songs Failed! '+failedSongs +'</span><button class="btn-flat toast-action" onclick="retryFailedSongs()">Retry</button>',
                classes: 'toast rounded toast-container',
                inDuration: 100,
                outDuration: 200
            })
        }
        addSongsToDownloadTable(songdata)
    }
}

function retryFailedSongs(){
    socket.emit("retrySongs",failedSongs)
}

socket.on("SpotifyLinkPlaylistInfo", (data, error) => {
    // console.log("recieved songs!")
    // console.log(data)
    resetPlaylistDelay();
    loadPlaylistDataBtn.classList.remove("disabled")

    // data = JSON.parse(data)
    // Important  = data;

    // tempImportant = Important.map(e => {
    //     return JSON.parse(e);
    // })
    // tempImportant = tempImportant.map(e => {
    //     return e[0];
    // })
    // // console.log(tempImportant)
    loadPlaylistData(data,error)
})
socket.on("YoutubePlaylistInfo", (data, error) => {
    resetPlaylistDelay();
    loadPlaylistDataBtn.classList.remove("disabled")
    // console.log(data)
    // data = JSON.parse(data)
    loadPlaylistData(data,error)
})

socket.on("searchForUsername", (data,error)=>{
    if (error) {
        // console.log("error from searchForUsername")
        return 
    }
    // console.log(data)
    searchUserSector.style.display = "inline-block"
    // console.log(playlistSelect.options)
    for (let i = 0; i < data.length; i++) {
        // console.log(i)
        playlistSelect.options[playlistSelect.options.length] = new Option(data[i]["name"], data[i]["uri"]);
    }
    M.FormSelect.init(playlistSelect, {});
})

function spotifyUserNameSearchBtnOnClick() {
    socket.emit("searchForUsername","spotifyUsername", playlistURLText.value )
    searchedForUser = 1;
    // // console.log("adasda")
    // data = ["playlist 1", "playlist 12", "playlist 13", "playlist 41"]
    
}

function playlistSelectOnChange() {
    if (playlistSelect.value != "") {
        loadPlaylistDataBtn.classList.remove("disabled");
    }
}

function playlistURLTextOnInput() {
    if (playlistURLText.value.match(playlistURLText.pattern)) {
        playlistURLText.classList.remove("invalid");
        playlistURLText.classList.add("valid");
        if (platform == 1 || platform == 0 && ((platformSectionState == 1 && searchUserSector.style.display == "inline-block" && searchUserSector.value != "") || platformSectionState == 0))
            loadPlaylistDataBtn.classList.remove("disabled")
        else
            loadPlaylistDataBtn.classList.add("disabled");
    } else {
        // console.log("2")
        playlistURLText.classList.remove("valid");
        playlistURLText.classList.add("invalid");
        loadPlaylistDataBtn.classList.add("disabled");
    }

}

function checkValidYoutubeLink(link) {
    // console.log(">?>>")
    //refernece
    //https://www.youtube.com/watch?v=cvaIgq5j2Q8&list=RDcvaIgq5j2Q8
    var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
    var match = link.match(regExp);
    return match && match[2]
    // if (match && match[2]){
    //     return match[2];
    // }
    // return null;
}

function checkValidSpotifyLink(link) {
    // console.log("!!!!")
    return link.replace(/https:\/\/open\.spotify\.com\/playlist\/[a-zA-z0-9=\+\-\?]+/g, "") == "" && link != ""
}

function playlistURLTextOnSubmit(e) {
    // // console.log(e)
    if (e.keyCode == 13) {

    }
}