<script>
import SpotifyWebApi from 'spotify-web-api-js';
export default {
  data() {
    return {
      topTracks: null,
      playingSongId: null,
      audio: new Audio(),
      spotifyApi: new SpotifyWebApi()
    }
  },
  created() {
    this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
    this.getTopTracks();
  },
  methods: {

    async getTopTracks() {
      this.$Progress.start()
      try {
        const topTracksData = await this.spotifyApi.getMyTopTracks();
        this.topTracks = topTracksData.items;
        this.$Progress.finish()
      } catch {
        this.$Progress.fail()
      }
    },
    playSong(songurl, songId) {
      if (this.isSongPlaying(songId)) {
        this.audio.pause();
        this.playingSongId = null;
      } else {
        this.audio.src = songurl;
        this.audio.play();
        this.playingSongId = songId;
        setTimeout(() => {
          this.playingSongId = null;
        }, 30000);
      }
    },
    isSongPlaying(songId) {
      return this.playingSongId === songId;
    }
  }
}
</script>
<template>
  <div class="w-100">
    <h4>Dina topplåtar</h4>
    <ul class="list-unstyled d-flex flex-column flex-wrap gap-3 mt-3" v-if="topTracks">
      <li v-for="songs in topTracks" class="songslist d-flex flex-row rounded">
        <div class="w-100 d-flex flex-row justify-content-between" style=" padding:0.2rem;">
          <p class="mt-2">{{ }}{{ songs.artists[0].name }} - {{ songs.name }}</p>
          <i class="bi bi-play-circle-fill fs-3 text-primary" @click="playSong(songs.preview_url, songs.id)"
            v-if="!isSongPlaying(songs.id)"></i>
          <i class="bi bi-pause-circle-fill fs-3 text-danger" @click="playSong()" v-if="isSongPlaying(songs.id)"></i>
        </div>
      </li>
    </ul>
    <div v-else class="d-flex justify-content-center align-content-center">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
</template>
<style>
ul {
  list-style-type: none !important;
}

i {
  cursor: pointer;
}

.songslist {
  background-color: rgb(237, 237, 237);
  padding: 0.3rem;
  border: 1px solid var(--bs-list-group-active-border-color);
  flex: 1 0 50%;
}
</style>
