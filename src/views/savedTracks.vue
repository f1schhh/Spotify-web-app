<script>
import SpotifyWebApi from 'spotify-web-api-js';
export default {
  data() {
    return {
      savedTracks: null,
      playingSongId: null,
      audio: new Audio(),
      spotifyApi: new SpotifyWebApi()
    }
  },
  created() {
    this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
    this.getsavedTracks();
  },
  methods: {

    async getsavedTracks() {
      this.$Progress.start()
      try {
        const savedTracksData = await this.spotifyApi.getMySavedTracks();
        this.savedTracks = savedTracksData.items;
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
    <h4>Några utav dina sparade låtar</h4>
    <ul class="list-unstyled d-flex flex-column flex-wrap gap-3 mt-3" v-if="savedTracks">
      <li v-for="songs in savedTracks" class="songslist d-flex flex-column rounded">
        <div class="w-100 d-flex flex-row justify-content-between" style=" padding:0.2rem;">
          <p class="mt-2">{{ }}{{ songs.track.artists[0].name }} - {{ songs.track.name }}</p>
          <i class="bi bi-play-circle-fill fs-3 text-primary" @click="playSong(songs.track.preview_url, songs.track.id)"
            v-if="!isSongPlaying(songs.track.id)"></i>
          <i class="bi bi-pause-circle-fill fs-3 text-danger" @click="playSong()"
            v-if="isSongPlaying(songs.track.id)"></i>
        </div>
        <span class="px-1 fs-7"> Lades till <em>{{ songs.added_at.split('T')[0] }}</em> </span>
      </li>
    </ul>
    <div v-else class="d-flex justify-content-center align-content-center">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
</template>
