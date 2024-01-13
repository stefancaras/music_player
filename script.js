import { music_list } from "./music_list.js";

const $ = (query) => document.querySelector(query);
let songs = [...music_list];
let prevIndex = [];
let songIndex = 0;
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
  const [artist, title] = song.split(" - ");
  currentSong = song;
  $(".artist").textContent = artist;
  $(".title").textContent = title;
  $("#audio").src = `./music/${song}.mp3`;
  $("#playlist").children[prevIndex.at(-1)]?.classList.remove("active");
  $("#playlist").children[songIndex].classList.add("active");
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
  prevIndex.push(songIndex);
  songIndex = random
    ? Math.floor(Math.random() * songs.length)
    : songIndex === songs.length - 1
    ? 0
    : songIndex + 1;
  loadSong(songs[songIndex]);
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
    prevIndex.push(songIndex);
    songIndex =
      prevIndex.length > 1
        ? prevIndex.at(-2)
        : songIndex
        ? songIndex - 1
        : songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
    prevIndex.pop();
    prevIndex.pop();
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
    prevIndex.push(songIndex);
    songIndex = +e.target.dataset.id;
    loadSong(songs[songIndex]);
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
  prevIndex = [];
  songIndex = 0;
  if (songs.includes(currentSong))
    $("#playlist").children[songs.indexOf(currentSong)].classList.add("active");
});

// Execute when page loads
loadPlaylist();
loadSong(songs[0]);
