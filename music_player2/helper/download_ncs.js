const ncs = require("nocopyrightsounds-api");
const axios = require("axios");
const fs = require("fs/promises");

(async () => {
  const songs = await ncs.getSongs(74);
  for (let i = 0; i < 20; i++) {
    const song = songs[i];
    const artists = song.artists.map((e) => e.name).join(", ");
    const audioUrl = song.download.regular;
    try {
      const { data: audioFile } = await axios.get(audioUrl, {
        responseType: "arraybuffer",
      });
      await fs.writeFile(`./music/${artists} - ${song.name}.mp3`, audioFile);
    } catch (error) {
      console.log("error");
    }
  }
})();
