<script>
import SpotifyWebApi from 'spotify-web-api-js';
export default {
  data() {
    return {
      albumData: null,
      albumSongs: null,
      playingSongId: null,
      previousRoute: this._backRoute,
      audio: new Audio(),
      fields: [
        { key: 'track_number', label: '#' },
        { key: 'name', label: 'Namn' },
        { key: 'artists', label: 'Artister' },
        { key: 'duration_ms', label: 'Längd' },
        { key: 'preview_url', label: 'Förhandslyssning' }
      ],
      spotifyApi: new SpotifyWebApi()
    }
  },
  created() {
    this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
    this.getAlbumData();
  },
  methods: {
    async getAlbumData() {
      this.$Progress.start();
      try {
        const albumData = await this.spotifyApi.getAlbum(this.$route.params.id);
        this.albumData = albumData;
        this.albumSongs = albumData.tracks;
        console.log(this.albumSongs)
      } catch {
        this.$Progress.fail();
      } finally {
        this.$Progress.finish();
      }
    },
    formatDuration(duration) {
      const minutes = Math.floor(duration / 60000);
      const seconds = ((duration % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
  },
}
</script>
<template>
  <b-container fluid="lg" class="d-flex flex-column mt-2">
    <b-breadcrumb>
      <b-breadcrumb-item to="/me">Hem</b-breadcrumb-item>
      <b-breadcrumb-item :to="`/artist/${albumData.artists[0].id}`">{{ albumData.artists[0].name }}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ albumData.name }}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="d-flex flex-column flex-wrap mt-3" v-if="albumData">
      <b-row style="min-width:100%;" fluid="lg">
        <b-col class="d-flex flex-column " md="3">
          <div class="w-100 d-flex flex-column justify-content-center align-items-center gap-2"
            style="border-bottom: 1px solid rgb(201, 201, 201);">
            <div class="img-wrapper d-flex align-items-center">
              <img :src="albumData.images[0].url" v-if="albumData.images.length > 0" class="avatar" alt="">
              <img src="https://do.lolwot.com/wp-content/uploads/2015/08/20-of-the-funniest-dog-photos-of-all-time-16.jpg"
                v-else class="avatar" alt="">
            </div>
            <h4>{{ albumData.name }}</h4>
          </div>
          <p class="mt-3">Utgivningsdatum: <b>{{ albumData.release_date }}</b> </p>
          <p>Förlag: <b>{{ albumData.label }}</b></p>
          <p>{{ albumData.copyrights[0].text }}</p>
        </b-col>
        <b-col md="9">
          <h4>Låtar</h4>
          <b-table striped hover :items="albumSongs.items" v-if="albumSongs" :fields="fields">
            <template #cell(track_number)="{ item }">
              {{ item.track_number }}
            </template>
            <template #cell(name)="{ item }">
              {{ item.name }}
            </template>
            <template #cell(artists)="{ item }">
              {{ item.artists.map(artist => artist.name).join(', ') }}
            </template>
            <template #cell(duration_ms)="{ item }">
              {{ formatDuration(item.duration_ms) }} min
            </template>
            <template #cell(preview_url)="{ item }">
              <div class="d-flex justify-content-center align-items-center">
                <i class="bi bi-play-circle-fill fs-3 text-primary" @click="playSong(item.preview_url, item.id)"
                  v-if="!isSongPlaying(item.id)"></i>
                <i class="bi bi-pause-circle-fill fs-3 text-danger" @click="playSong()" v-if="isSongPlaying(item.id)"></i>
              </div>
            </template>
          </b-table>
          <div v-else class="d-flex justify-content-center align-content-center"><b-spinner
              label="Loading..."></b-spinner>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
