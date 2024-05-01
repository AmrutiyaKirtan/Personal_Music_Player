let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00 : 00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder
    let a = await fetch(`Day84%5BFull%20Stack%20Project%5D/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all the songs in the playlist
    let songsUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songsUL.innerHTML = ""
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
                                               <div class="info">
                                                   <div>${song.replaceAll("%20", " ")}</div>
                                                   <div>Kirtan</div>
                                               </div>
                                               <div class="playnow">
                                                   <span>Play Now</span>
                                                   <img src="img/play.svg" alt="">
                                               </div></li>`;
    }

    // Attach an event listener to each song 
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("Day84%5BFull%20Stack%20Project%5D/songs/"+track)
    currentSong.src = `/Day84%5BFull%20Stack%20Project%5D/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}
async function displayAlbums() {
    let a = await fetch(`Day84%5BFull%20Stack%20Project%5D/songs/`)

    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let folder = e.href.split("/").slice(-2)[0];
            // getting meta data of the folder
            let a = await fetch(`Day84%5BFull%20Stack%20Project%5D/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="24px"
                    height="24px" class="Svg-sc-ytk21e-0 bneLcE">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg>
            </div>
            <img src="/Day84%5BFull%20Stack%20Project%5D/songs/${folder}/cover.jpeg">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }
    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0], false)
        })
    })
}
async function main() {

    //get ths list of all the songs 
    await getsongs("songs/ncs")
    playMusic(songs[0], true)

    //display all the albums on the page
    displayAlbums()

    //Attach an event listener to the play, next and previous button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for time update event

    currentSong.addEventListener('error', function () {
        // console.log('Error loading audio file');
    });

    currentSong.addEventListener('canplaythrough', function () {
        // console.log(currentSong.duration);
    });


    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
    })

    //add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //add an event listener for hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px"
    })

    //add and event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listener to previous and next button

    //For previous
    previous.addEventListener("click", () => {
        // console.log('Previous clicked');
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //For next
    next.addEventListener("click", () => {

        // console.log('Next clicked');

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add an event to vloume bar
    document.querySelector(".range").addEventListener("change", (e) => {
        // console.log(e,e.target,e.target.value);
        // console.log('Volume',e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
    });
    //add an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        // console.log(e.target);
        if(e.target.src.includes( "img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
            currentSong.volume = 0.1;
            document.querySelector(".range").value = 10;
        }
    })



}
main()       