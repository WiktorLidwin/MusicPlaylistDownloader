function addIndividualSongsBtnOnClick() {
    if (addIndividualSongsSubSector.style.display == "block") {
        addIndividualSongsSubSector.style.display = "none"
    } else {
        addIndividualSongsSubSector.style.display = "block"
    }
}

function individualSongSelectOnChange() {
    if (individualSongSelect.value != "") {
        songSearchSector.style.display = "block"
    }
    if (individualSongSelect.value == "Spotify") {
        currentRegex = spotifySongRegex
        individualSongLabel.innerHTML = "Spotify URL"
    } else if (individualSongSelect.value == "None") {
        currentRegex = songNameRegex
        individualSongLabel.innerHTML = "Song Name"
    } else if (individualSongSelect.value == "Youtube") {
        currentRegex = youtubeSongRegex
        individualSongLabel.innerHTML = "Youtube URL (Ex. \"www.youtube.com/watch?v=id\")"
    }
    individualSongInputOnInput()
}

function individualSongInputOnInput() {
    if (individualSongInput.value != "" && currentRegex.exec(individualSongInput.value) != null) {
        individualSongInput.classList.remove("invalid");
        individualSongInput.classList.add("valid");
        addSongBtn.classList.remove("disabled")

    } else {
        individualSongInput.classList.remove("valid");
        individualSongInput.classList.add("invalid");
        addSongBtn.classList.add("disabled");
    }
}
socket.on("searchSong", data =>{
    console.log(data)
    if(data.length!== undefined ){
        makeAddSongTable(data)
    }else{

    }
    
})

function addSongBtnOnClick() {
    socket.emit("searchSong",individualSongSelect.value,individualSongInput.value)
    //send request for data
    // data = [
    //     ["12", "4"],
    //     ["13", "5"],
    //     ["14", "6"]
    // ]
}

function makeAddSongTable(data) {
    addSongs = []
    addSongBtnArray = []
    addSongTable.style.display = "table"
    while (addSongTableBody.firstChild) {
        addSongTableBody.firstChild.remove()
    }
    TempSongs = data;
    for (let i = 0; i < data.length; i++) {
        addSongs[i] = new song(data[i]["title"], data[i]["author"],data[i]["id"],data[i]["length"], i)
        addSongBtnArray[i] = false;
        row = document.createElement("tr");
        songName = document.createElement("td");
        songName.innerHTML = data[i]["title"]
        songAuthor = document.createElement("td");
        songAuthor.innerHTML = data[i]["author"]
        addSongTableBtn = document.createElement("a");
        addSongTableBtn.className = ("waves-effect waves-light btn table-btn");
        addSongTableBtn.innerHTML = "Add Song?"
        addSongTableBtn.style.backgroundColor = "grey"
        addSongTableBtn.addEventListener("click", (e) => {
            // console.log(e)
            // console.log("HEREHHRdbsjhfbjshbdfhjsdbf")
            addSongTableBtnOnClick(e.toElement, e.toElement.id);
        })



        addSongTableBtn.id = "addSongTableBtn" + i;
        row.appendChild(songName)
        row.appendChild(songAuthor)
        row.appendChild(addSongTableBtn)
        addSongTableBody.appendChild(row)
    }
}

function addSongTableBtnOnClick(btn, btnID) {
    // console.log("hi")

    btnID = btnID.replace(/addSongTableBtn/g, "")
    console.log(btn, btnID)
    if (addSongBtnArray[btnID]) {
        //add song to queue

        addSongsToDownloadTable([
            [addSongs[btnID].name, addSongs[btnID].author,addSongs[btnID].videoId,addSongs[btnID].length]
        ])
        makeAddSongTable([])
        addSongTable.style.display = "none"
        console.log("add Song")
        return
    } else {
        addSongBtnArray = [];
        for (let i = 0; i < addSongs.length; i++) {
            addSongBtnArray[i] = false;
            tempbtn = document.getElementById("addSongTableBtn" + i)
            console.log(tempbtn)
            tempbtn.style.backgroundColor = "grey"
            tempbtn.innerHTML = "Add Song?"
        }
        btn.style.backgroundColor = "green"
        btn.innerHTML = "Confirm?"
        addSongBtnArray[btnID] = true;
    }
}




// document.getElementById('URLSector').addEventListener('submit', function (e) {
//     // search(document.getElementById('URLSector'));
//     e.preventDefault();
// }, false);