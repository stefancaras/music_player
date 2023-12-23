import ncs from "nocopyrightsounds-api";
import axios from "axios";
import fs from "fs/promises";

// getting the newest 20 songs (20 songs = 1 page)
const songs = await ncs.getSongs();

const newestSong = songs[0];
const audioUrl = newestSong.download.regular;

if (!audioUrl)
  throw "This Song doesn't have a regular (non instrumental) version!";

// downloading audio
const { data: audioFile } = await axios.get(audioUrl, {
  responseType: "arraybuffer",
});

await fs.writeFile(`${newestSong.name}.mp3`, audioFile);
