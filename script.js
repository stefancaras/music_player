import { music_list } from "./music_list.js";

const $ = (query) => document.querySelector(query);
let songs = [...music_list];
let songIndex = 0;
const prevSongs = [];
let currentSong = "";
let repeat = false;
let random = false;

// Functions
const loadPlaylist = () => {
  let string = "";
  songs.forEach((song, i) => {
    string += `<li class="list-group-item"><i data-id=${i} class="fas fa-play"></i><span>${song}</span></li>`;
  });
  $("#playlist").innerHTML = string;
};

const loadSong = (song) => {
  if (!song) song = music_list[0];
  const [artist, title] = song.split(" - ");
  $(".artist").textContent = artist;
  $(".title").textContent = title;
  $("#audio").src = `./music/${song}.mp3`;
  $("#playlist").children[songs.indexOf(currentSong)]?.classList.remove(
    "active"
  );
  currentSong = song;
  songIndex = songs.indexOf(currentSong);
  $("#playlist").children[songIndex]?.classList.add("active");
};

const playSong = () => {
  $("#play>i").classList.remove("fa-play");
  $("#play>i").classList.add("fa-pause");
  $("#audio").play();
};

const pauseSong = () => {
  $("#play>i").classList.add("fa-play");
  $("#play>i").classList.remove("fa-pause");
  $("#audio").pause();
};

const nextSong = () => {
  prevSongs.push(currentSong);
  loadSong(
    songs[
      random
        ? Math.floor(Math.random() * songs.length)
        : songIndex === songs.length - 1
        ? 0
        : songs.indexOf(currentSong) + 1
    ]
  );
  playSong();
};

// Event listeners
$("#progress-container").addEventListener("click", (e) => {
  $("#audio").currentTime =
    (e.offsetX / $("#progress-container").clientWidth) * $("#audio").duration;
});

$("#navigation").addEventListener("click", (e) => {
  const id = e.target.id;
  const parentId = e.target.parentElement.id;
  if (id === "play" || parentId === "play") {
    $("#play>i").classList.contains("fa-pause") ? pauseSong() : playSong();
  } else if (id === "prev" || parentId === "prev") {
    loadSong(
      prevSongs[0]
        ? prevSongs.at(-1)
        : songs[songIndex > 0 ? songIndex - 1 : songs.length - 1]
    );
    playSong();
    prevSongs.pop();
  } else if (id === "next" || parentId === "next") {
    nextSong();
  } else if (id === "repeat" || parentId === "repeat") {
    $("#repeat").classList.toggle("text-pink");
    repeat = !repeat;
  } else if (id === "random" || parentId === "random") {
    $("#random").classList.toggle("text-pink");
    random = !random;
  }
});

$("#playlist").addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    prevSongs.push(currentSong);
    loadSong(songs[+e.target.dataset.id]);
    playSong();
  }
});

$("#audio").addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.target;
  const min = Math.floor(currentTime / 60 || 0);
  const sec = Math.floor(currentTime % 60 || 0);
  $(".progress").style.width = `${(currentTime / duration) * 100}%`;
  $("#curr-time").textContent = min + ":" + (sec < 10 ? "0" + sec : sec);
});

$("#audio").addEventListener("loadedmetadata", (e) => {
  const duration = e.target.duration;
  const min = Math.floor(duration / 60 || 0);
  const sec = Math.floor(duration % 60 || 0);
  $("#dur-time").textContent = min + ":" + (sec < 10 ? "0" + sec : sec);
});

$("#audio").addEventListener("ended", () => (repeat ? playSong() : nextSong()));

$("#filter").addEventListener("keyup", (e) => {
  songs = music_list.filter((song) =>
    new RegExp(`${e.target.value.toLowerCase()}`).test(song.toLowerCase())
  );
  loadPlaylist();
  songIndex = 0;
  $("#playlist").children[songs.indexOf(currentSong)]?.classList.add("active");
});

// Execute when page loads
loadPlaylist();
loadSong(songs[0]);
