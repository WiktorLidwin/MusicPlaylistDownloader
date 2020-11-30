function addProgressBars() {
    for (let i = 0; i < Songs.length; i++) {
        tr = document.getElementById("downloadSongRowID" + Songs[i].id)
        deletebtn = document.getElementById("songBtn" + Songs[i].id)
        tr.removeChild(deletebtn);
        groupingtd = document.createElement("td")
        textdiv = document.createElement("div")
        textdiv.id = "textdiv" + Songs[i].id
        groupingtd.appendChild(textdiv)
        groupingtd.id = "groupingtd" + Songs[i].id
        if (downloadStateArray[Songs[i].id] == 1 || downloadStateArray[Songs[i].id] == 2) {
            groupingtd.appendChild(createProgressBar(Songs[i].id))
        }
        if (downloadStateArray[Songs[i].id] == 0) {
            textdiv.innerHTML = "Starting"
        } else if (downloadStateArray[Songs[i].id] == 1) {
            textdiv.innerHTML = "Downloading..."
        } else if (downloadStateArray[Songs[i].id] == 2) {
            textdiv.innerHTML = "Converting..."
        } else if (downloadStateArray[Songs[i].id] == 3) {
            textdiv.innerHTML = "Finished"
        }
        tr.appendChild(groupingtd)
    }
}

function createProgressBar(id) {
    progressBar = document.createElement("div")
    progressBar.classList = "progress-bar"
    progressBar.style.setProperty('--width', downloadPercentArray[id])
    progressBar.setAttribute("datalabel", downloadPercentArray[id] + "%")
    progressBar.id = "progressBar" + id
    return progressBar
}

function updateProgressBars() {
    for (let i = 0; i < Songs.length; i++) {
        textdiv = document.getElementById("textdiv" + Songs[i].id)
        groupingtd = document.getElementById("groupingtd" + Songs[i].id)
        progressBar = document.getElementById("progressBar" + Songs[i].id)
        if (progressBar != null && (downloadStateArray[Songs[i].id] == 0 || downloadStateArray[Songs[i].id] == 3)) {
            progressBar.parentNode.removeChild(progressBar)
        } else if (progressBar == null && (downloadStateArray[Songs[i].id] == 1 || downloadStateArray[Songs[i].id] == 2)) {
            progressBar = createProgressBar(Songs[i].id)
            groupingtd.appendChild(progressBar)
        } else if (progressBar != null && (downloadStateArray[Songs[i].id] == 1 || downloadStateArray[Songs[i].id] == 2)) {
            progressBar.style.setProperty('--width', downloadPercentArray[Songs[i].id])
            progressBar.setAttribute("datalabel", downloadPercentArray[Songs[i].id] + "%")
        }
        if (downloadStateArray[Songs[i].id] == 0) {
            textdiv.innerHTML = "Starting"
        } else if (downloadStateArray[Songs[i].id] == 1) {
            textdiv.innerHTML = "Downloading..."
        } else if (downloadStateArray[Songs[i].id] == 2) {
            textdiv.innerHTML = "Converting..."
        } else if (downloadStateArray[Songs[i].id] == 3) {
            textdiv.innerHTML = "Finished"
        }
    }
}

function clearSongsBtnOnClick() {
    currentSongCount = 0;
    clearSongsBtn.innerHTML = `CLEAR QUEUE (${currentSongCount + (currentSongCount ==1? "SONG":"SONGS")})`
    songsToUndo = []
    for (let i = 0; i < Songs.length; i++) {
        Songs[i].download = false;
        row = document.getElementById("downloadSongRowID" + Songs[i].id)
        if (getComputedStyle(row, null).display != "none")
            songsToUndo.push(i);
        row.style.display = "none";
    }
    M.Toast.dismissAll();
    M.toast({
        html: '<span>Cleared Queue</span><button class="btn-flat toast-action" onclick="undoClearQueue()">Undo</button>'
    })
}

function undoClearQueue() {
    currentSongCount += songsToUndo.length;
    clearSongsBtn.innerHTML = `CLEAR QUEUE (${currentSongCount + (currentSongCount ==1? "SONG":"SONGS")})`
    M.Toast.dismissAll();
    for (let i = 0; i < songsToUndo.length; i++) {
        Songs[songsToUndo[i]].download = true;
        row = document.getElementById("downloadSongRowID" + songsToUndo[i])
        row.style.display = "table-row"
    }
}
function overrideDuplicateSongs() {
    M.Toast.dismissAll();
    addSongsToDownloadTable(duplicateSongArray, true)
}

function qualitySelectOnChange(){
    downloadSongsBtn.classList.remove("disabled")
}

function resetTableBtns() {

    for (let i = 0; i < songBtnIDcounter; i++) {
        songBtnArray[i] = false;
        tempbtn = document.getElementById("songBtn" + i)
        if (tempbtn != null) {
            tempbtn.style.backgroundColor = "grey"
            tempbtn.innerHTML = "Delete?"
        }
    }
    for (let i = 0; i < addSongs.length; i++) {
        addSongBtnArray[i] = false;
        tempbtn = document.getElementById("addSongTableBtn" + i)
        tempbtn.style.backgroundColor = "grey"
        tempbtn.innerHTML = "Add Song?"
    }
}

function undoSongRemove() {
    currentSongCount ++;
    clearSongsBtn.innerHTML = `CLEAR QUEUE (${currentSongCount + (currentSongCount ==1? "SONG":"SONGS")})`
    M.Toast.dismissAll();
    Songs[idToUndo].download = true;
    rowToUndo = document.getElementById("downloadSongRowID" + idToUndo)
    rowToUndo.style.display = "table-row";
}

function getVideoIds(){
    videoIds = []
    for (let i = 0; i < Songs.length; i++) {
        if (Songs[i].download){
            videoIds.push(Songs[i].videoId)
        }
    }
    return videoIds
}

function prepareForDownload(){
    for (let i = 0; i < Songs.length; i++) {
        if (Songs[i].download){
            buffers[i] = [];
            bufferLengths[i] = 0;
        }
    }
}

function downloadSongsBtnOnClick() {
    clearSongsBtn.classList.add("disabled")
    addIndividualSongsSubSector.style.display = "none"
    addIndividualSongsBtn.classList.add("disabled")
    addPlaylistSubSector.style.display = "none"
    addPlaylistBtn.classList.add("disabled")
    downloadSongsBtn.classList.add("disabled")
    //startdownload
    prepareForDownload();
    socket.emit("downloadSongs", getVideoIds(),qualitySelect.value)
    // for (let i = 0; i < Songs.length; i++) {
    //     downloadStateArray[i] = 1;
    //     downloadPercentArray[i] = Math.floor(Math.random() * 100)
    // }
    addProgressBars()
    // setInterval(() => {
    //     updateProgressBars()
    //     for (let i = 0; i < Songs.length; i++) {
    //         downloadPercentArray[i] = Math.floor(Math.random() * 100)
    //     }
    // }, 1000 / 5)
}


// checkValidity
function addSongsToDownloadTable(data, doNotCheckForDuplicate = false) {
    songNames = getSongNames()
    songAuthors = getSongAuthors()


    dataSongAuthors = []
    dataSongNames = []
    for (let i = 0; i < data.length; i++) {
        if(data[i] != null ){
            dataSongNames[i] = data[i][0]
            dataSongAuthors[i] = data[i][1]
        }
        
    }
   
    if (doNotCheckForDuplicate == false) {
        duplicateSongArray = []
        duplicateCount = 0;
        for (let i = 0; i < songNames.length; i++) { //todo 
            if (dataSongNames.indexOf(songNames[i]) != -1 && songAuthors[i] == dataSongAuthors[dataSongNames.indexOf(songNames[i])]) {
                duplicateSongArray.push(data[dataSongNames.indexOf(songNames[i])])
                duplicateCount++;
                data[dataSongNames.indexOf(songNames[i])] = null
            }
        }
        if (duplicateCount != 0) {
            M.Toast.dismissAll();
            M.toast({
                //<span>Cleared Queue</span><button class="btn-flat toast-action" onclick="undoClearQueue()">Undo</button>
                html: '<span>Found ' + duplicateCount + ' duplicate ' + (duplicateCount == 1 ? ' song' : ' songs') + '. Not adding to queue. </span><button class="btn-flat toast-action" onclick="overrideDuplicateSongs()">Override</button>'
                //'<div>Found '+duplicateCount+' duplicate '+(duplicateCount == 1 ? ' song':' songs')+'. Not adding to queue. </div>'
            })
        }
    }
    songTable.style.display = "table"
    currentSongCount += data.length;
    clearSongsBtn.innerHTML = `CLEAR QUEUE (${currentSongCount + (currentSongCount ==1? "SONG":"SONGS")})`
    // console.log(songTable.style.display)
    for (let i = 0; i < data.length; i++) {
        if (data[i] != null) {
            tempSong = new song(data[i][0], data[i][1],data[i][2],data[i][3], songBtnIDcounter)
            Songs[songBtnIDcounter] = tempSong;
            songBtnArray[songBtnIDcounter] = false;
            row = document.createElement("tr");
            songName = document.createElement("td");
            songName.innerHTML = data[i][0]
            songAuthor = document.createElement("td");
            songAuthor.innerHTML = data[i][1]

            songBtn = document.createElement("a");
            songBtn.className = ("waves-effect waves-light btn table-btn");
            songBtn.innerHTML = "Delete?"
            songBtn.style.backgroundColor = "grey"
            songBtn.addEventListener("click", (e) => {
                songBtnOnClick(e.toElement, e.toElement.id);
            })
            songBtn.id = "songBtn" + songBtnIDcounter;

            row.appendChild(songName)
            row.appendChild(songAuthor)
            row.appendChild(songBtn)
            row.id = "downloadSongRowID" + songBtnIDcounter
            songTableBody.prepend(row)
            songBtnIDcounter++;
        }
    }
    downloadSector.style.display = "block"
    // downloadSongsBtn.style.display = "inline-block"
    // clearSongsBtn.style.display = "inline-block"
    // qualitySelect.style.display = "block"
}

function songBtnOnClick(btn, btnID) {
    btnID = btnID.replace(/songBtn/g, "")
    if (songBtnArray[btnID]) {
        //add song to queue
        currentSongCount--;
        clearSongsBtn.innerHTML = `CLEAR QUEUE (${currentSongCount + (currentSongCount ==1? "SONG":"SONGS")})`
        
        row = document.getElementById("downloadSongRowID" + btnID)
        if (row == null) {
            return
        }
        Songs[btnID].download = false;
        songBtnArray[btnID] = false;
        M.Toast.dismissAll();
        M.toast({
            html: '<span>Removed Song</span><button class="btn-flat toast-action" onclick="undoSongRemove()">Undo</button>'
        })
        idToUndo = btnID;
        row.style.display = "none";
        return
    } else {
        songBtnArray = [];
        for (let i = 0; i < songBtnIDcounter; i++) {
            songBtnArray[i] = false;
            tempbtn = document.getElementById("songBtn" + i)
            if (tempbtn != null) {
                tempbtn.style.backgroundColor = "grey"
                tempbtn.innerHTML = "Delete?"
            }
        }
        btn.style.backgroundColor = "red"
        btn.innerHTML = "Confirm?"
        songBtnArray[btnID] = true;
    }
}


document.addEventListener("click", (e) => {
    if (!e.toElement.id.includes("songBtn") && !e.toElement.id.includes("addSongTableBtn"))
        resetTableBtns();
})

function findSongIdwithVideoId(videoId){
    for (let i = 0; i < Songs.length; i++) {
        if(Songs[i].videoId == videoId)
            return Songs[i].id
    }
    return -1;
}

ss(socket).on('file', (stream, videoId) => {
    let id = findSongIdwithVideoId(videoId)
    if(id == -1){
        return
    }
    downloadStateArray[id] = 1;
    

    stream.on('data', function (chunk) {
        bufferLengths[id] += chunk.length;
        buffers[id].push(chunk);
    });
    stream.on('end', function () {
        downloadStateArray[id] = 3;
        updateProgressBars()
        var filedata = new Uint8Array(bufferLengths[id]),
            i = 0;

        buffers[id].forEach(function (buff) {
            for (var j = 0; j < buff.length; j++) {
                filedata[i] = buff[j];
                i++;
            }
        });

        downloadFileFromBlob([filedata], Songs[id].name+".mp3");
    });
});

socket.on("downloadInfo", (percent, videoId)=>{
    // console.log("videoId: "+videoId+"  "+percent*100+"%")
    downloadPercentArray[findSongIdwithVideoId(videoId)] = Math.floor(percent * 100)
    updateProgressBars()
    
})

var downloadFileFromBlob = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob(data, {
            type: "octet/stream"
        }),
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());