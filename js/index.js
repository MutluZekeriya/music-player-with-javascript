const container = document.querySelector(".container");
const img = document.getElementById("music-image");
const audio = document.getElementById("audio");
const title = document.querySelector(".title")
const singer = document.querySelector(".singer")
const prev = document.getElementById("prev");
const play = document.getElementById("play");
const next = document.getElementById("next");
const current_time = document.getElementById("current-time");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progress-bar");
const volume = document.getElementById("volume");
const volumeBar = document.getElementById("volume-bar");
const music_list = document.getElementById("music-list-content");




fetch("https://api.deezer.com/radio")
	.then((response) => {        
        console.log(response);
    }) //parse json data
	.then(function (todos) {
		todos.forEach((todo) => {
			console.log(todo.title); //Başlıkları console' a yazdırma
		});
	});



const player = new MusicPlayer(musicList);


window.addEventListener("load", () => {
    const music = player.getMusic()
    displayMusic(music);
    displayMusicList(player.musicList);   
    isPlayingNow();

})

function displayMusic(pMusic) {
    title.innerText = pMusic.getName();
    // singer.innerText = pMusic.singer;
    img.src = "img/" + pMusic.img;
    audio.src = "mp3/" + pMusic.file;
}


// play button
play.addEventListener("click", () => {
    const isMusicPLay = container.classList.contains("playing")
    isMusicPLay ? pauseMusic() : playMusic();
})

function playMusic() {
    audio.play();
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    console.log();
}
function pauseMusic() {
    audio.pause();
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
}

// prev button
prev.addEventListener("click", () => {
    prevMusic();
    console.log("prev");
})

function prevMusic() {
    player.previous()
    const music = player.getMusic()
    displayMusic(music);
    if (container.classList.contains("playing")) {
        playMusic()
    }
    isPlayingNow();
};

// next button
next.addEventListener("click", () => {
    nextMusic();
    console.log("next");
})

function nextMusic() {
    player.next()
    const music = player.getMusic()
    displayMusic(music);
    if (container.classList.contains("playing")) {
        playMusic()
    }
    isPlayingNow();
};

//auido 
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration)
})

function calculateTime(seconds) {
    let minute = Math.floor(seconds / 60);
    let second = Math.floor(seconds % 60) < 10 ? "0" + Math.floor(seconds % 60) : Math.floor(seconds % 60);
    return minute + ":" + second
}

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    current_time.textContent = calculateTime(progressBar.value)
})


progressBar.addEventListener("input", () => {
    current_time.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
})

// volume

let stateMuted = "muted";
volume.addEventListener("click", () => {
    if (stateMuted === "muted") {
        audio.muted = true;
        stateMuted = "unmuted";
        volume.classList = "fa-solid fa-volume-xmark"
        volumeBar.value = 0;
    } else {
        audio.muted = false;
        stateMuted = "muted"
        volume.classList = "fa-solid fa-volume-high"
        volumeBar.value = 100;
    }
})
volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    if (value == 0) {
        audio.muted = true;
        stateMuted = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark"
    } else {
        audio.muted = false;
        stateMuted = "sesli";
        volume.classList = "fa-solid fa-volume-high"
    }
})

// music List
const displayMusicList = ( list ) => {

    for (let index = 0; index < list.length; index++) {
       let tagList = `
            <li li-index="${index}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>  ${ list[index].getName() } </span>
            <span id="music-${index}" class="badge bg-badget rounded-pill">  </span>
            <audio class="music-${index}" src="mp3/${list[index].file}"></audio>
        </li> 
       `;

       music_list.insertAdjacentHTML("beforeend", tagList);

       let liAudioDuration = music_list.querySelector(`#music-${index}`);
       let liAudioTag = music_list.querySelector(`.music-${index}`);

       liAudioTag.addEventListener("loadeddata", () => {
            let time = Math.floor(liAudioTag.duration);
            liAudioDuration.textContent = calculateTime(time)
       })   
        
    }
    
}
const selectedMusic = ( li ) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic())
    playMusic();
    isPlayingNow();

}

const isPlayingNow = ()  => {
    for (let li of music_list.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic()
})