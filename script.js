const $ = (query) => document.querySelector(query);
const songs = [
  "Cartoon - On & On (feat. Daniel Levi)",
  "Janji - Heroes Tonight (feat. Johnning)",
  "DEAF KEV - Invincible",
  "Different Heaven & EH!DE - My Heart",
  "Warriyo - Mortals (feat. Laura Brehm)",
  "Disfigure - Blank",
  "Elektronomia - Sky High",
  "Cartoon - Why We Lose (feat. Coleman Trapp)",
  "Electro-Light - Symbolism",
  "Lost Sky - Fearless pt.II (feat. Chris Linton)",
];
let prevIndex = 0;
let songIndex = 0;

songs.forEach(
  (song, i) =>
    ($(
      ".playlist"
    ).innerHTML += `<li class="list-group-item"><i data-id=${i} class="fas fa-play"></i><span>${song}</span></li>`)
);

const loadSong = (song) => {
  const [artist, title] = song.split(" - ");
  $(".artist").textContent = artist;
  $(".title").textContent = title;
  $("#audio").src = `music/${songIndex}.mp3`;
  $("#cover").src = `images/${songIndex}.jpg`;
  $(".playlist").childNodes[prevIndex].classList.remove("active");
  $(".playlist").childNodes[songIndex].classList.add("active");
};

const playSong = () => {
  $(".music-container").classList.add("play");
  $("#play>i.fas").classList.remove("fa-play");
  $("#play>i.fas").classList.add("fa-pause");
  $("#audio").play();
};

const pauseSong = () => {
  $(".music-container").classList.remove("play");
  $("#play>i.fas").classList.add("fa-play");
  $("#play>i.fas").classList.remove("fa-pause");
  $("#audio").pause();
};

const nextSong = () => {
  prevIndex = songIndex;
  songIndex = songIndex === songs.length - 1 ? 0 : songIndex + 1;
  loadSong(songs[songIndex]);
  playSong();
};

$("#play").addEventListener("click", () => {
  $(".music-container").classList.contains("play") ? pauseSong() : playSong();
});

$("#prev").addEventListener("click", () => {
  prevIndex = songIndex;
  songIndex = songIndex ? songIndex - 1 : songs.length - 1;
  loadSong(songs[songIndex]);
  playSong();
});

$("#next").addEventListener("click", nextSong);

$(".playlist").addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    prevIndex = songIndex;
    songIndex = +e.target.dataset.id;
    loadSong(songs[songIndex]);
    playSong();
  }
});

$("#audio").addEventListener("ended", nextSong);

$(".progress-container").addEventListener("click", (e) => {
  $("#audio").currentTime =
    (e.offsetX / $(".progress-container").clientWidth) * $("#audio").duration;
});

$("#audio").addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.target;
  const min = Math.floor(currentTime / 60 || 0);
  const sec = Math.floor(currentTime % 60);
  $(".progress").style.width = `${(currentTime / duration) * 100}%`;
  $("#curr-time").textContent = min + ":" + (sec < 10 ? "0" + sec : sec);
});

$("#audio").addEventListener("loadedmetadata", (e) => {
  const duration = e.target.duration;
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration % 60);
  $("#dur-time").textContent = min + ":" + (sec < 10 ? "0" + sec : sec);
});

loadSong(songs[songIndex]);
