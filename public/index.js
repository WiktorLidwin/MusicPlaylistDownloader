//global vars
viewState = 0;
platformSectionState = 0;
platform = null;
searchedForUser = 0;
platforms = ["Spotify", "Youtube"]
platformBtn = document.getElementById("platformBtn")
playlistURLText = document.getElementById("playlistURLText")
playlistURLLabel = document.getElementById("playlistURLLabel")
rotatePlatformSectionBtn = document.getElementById("rotatePlatformSectionBtn")
loadPlaylistDataBtn = document.getElementById("loadPlaylistDataBtn")
spotifyUserNameSearchBtn = document.getElementById("spotifyUserNameSearchBtn")
searchUserSector = document.getElementById("searchUserSector")
URLSector = document.getElementById("URLSector")
playlistSelect = document.getElementById("playlistSelect")
songTable = document.getElementById("songTable")
songTableBody = document.getElementById("songTableBody")
downloadSongsBtn = document.getElementById("downloadSongsBtn")
addIndividualSongsBtn = document.getElementById("addIndividualSongsBtn")
addPlaylistBtn = document.getElementById("addPlaylistBtn")
addPlaylistSubSector = document.getElementById("addPlaylistSubSector")
addIndividualSongsSubSector = document.getElementById("addIndividualSongsSubSector")
individualSongSelect = document.getElementById("individualSongSelect")
addSongBtn = document.getElementById("addSongBtn")
addSongTable = document.getElementById("addSongTable")
addSongTableBody = document.getElementById("addSongTableBody")
songSearchSector = document.getElementById("songSearchSector")
qualitySelect = document.getElementById("qualitySelect")
downloadSector = document.getElementById("downloadSector")


currentRegex = null;
userNameRegex = /.+/g
songNameRegex = /.+/g
spotifyPlaylistRegex = /(https:\/\/open\.spotify\.com\/playlist\/[a-zA-z0-9=\+\-\?]+)/g
youtubePlaylistRegex = /(https|http):\/\/(?:www\.)?youtube\.com\/watch\?(?:&.*)*((?:v=([a-zA-Z0-9_\-]{11})(?:&.*)*&list=([a-zA-Z0-9_\-]{18}))|(?:list=([a-zA-Z0-9_\-]{18})(?:&.*)*&v=([a-zA-Z0-9_\-]{11})))(?:&.*)*(?:\#.*)*/g

spotifySongRegex = /[\bhttps://open.\b]*spotify[\b.com\b]*[/:]*track[/:]*[A-Za-z0-9?=]+/g
youtubeSongRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/gm;
console.log(songTableBody == null)
var style = window.getComputedStyle(playlistURLText)
console.log(style.getPropertyValue('display'))
songBtnArray = [];
addSongs = [];
addSongBtnArray = [];
songBtnIDcounter = 0;
idToUndo = -1;
songsToUndo = [];
Songs = [];
downloadStateArray = []; //0 = not started 1 = downloading 2 = converting 3 = finished
downloadPercentArray = [];
duplicateSongArray = []
currentSongCount = 0;
bufferLengths = [];
buffers = []

//Cooldowns to not fuck server
DelayBetweenPlaylistRequests = 20;
CurrentDelayBetweenPlaylistRequests = 0;

//Server
var socket = io();


function getSongNames() {
    temp = []
    for (let i = 0; i < Songs.length; i++) {
        temp[i] = Songs[i].name
    }
    return temp
}

function getSongAuthors() {
    temp = []
    for (let i = 0; i < Songs.length; i++) {
        temp[i] = Songs[i].author
    }
    return temp
}

function song(name, author, videoId, length, id, download=true) {
    this.name = name
    this.author = author;
    this.videoId = videoId
    this.length = length
    this.id = id;
    this.download = download;
}


document.addEventListener('DOMContentLoaded', function () {
    options = {}
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);

});

// downloadSongBtn.addEventListener("mouseover", function( event ) {   
//     // highlight the mouseenter target
//     event.target.style.color = "purple";
  
//     // reset the color after a short delay
//     setTimeout(function() {
//       event.target.style.color = "";
//     }, 500);
//   }, false);

socket.on("youtubePlaylistData", data => {
    console.log("data:")
    console.log(data)
})

socket.on("test",(data)=>{
    console.log("test! "+data)
})

//TODO make a search tbn for the songs
//TODO make the download table a select button like the circle
//then make 2 options: delete selected, delete all besides selected

function reportBugBtnOnClick(){
    socket.emit("logBug",reportBugTextArea.value)
    reportBugTextArea.value = ""
    var toastHTML = "Thank you!";
        M.toast({
            html: toastHTML,
            classes: 'toast rounded toast-container',
            inDuration: 100,
            outDuration: 200
        })
}