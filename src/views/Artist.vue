<script>
import SpotifyWebApi from 'spotify-web-api-js';
export default {
  data() {
    return {
      artistData: null,
      artistName: null,
      artistAlbums: null,
      artistTopTracks: null,
      spotifyApi: new SpotifyWebApi()
    }
  },
  created() {
    this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
    this.getArtistData();
    this.getArtistAlbums();
    this.getArtistTopTracks();
  },
  methods: {
    async getArtistData() {
      this.$Progress.start()
      const artistData = await this.spotifyApi.getArtist(this.$route.params.id);
      this.artistData = artistData;
      this.artistName = artistData.name;
      this.$Progress.finish()
    },
    async getArtistAlbums() {
      this.$Progress.start()
      const artistAlbumsData = await this.spotifyApi.getArtistAlbums(this.$route.params.id);
      this.artistAlbums = artistAlbumsData.items;
      this.$Progress.finish()
    },
    async getArtistTopTracks() {
      const artistTopTracksData = await this.spotifyApi.getArtistTopTracks(this.$route.params.id, 'SE');
      this.artistTopTracks = artistTopTracksData.tracks
    },
    goToAlbum(id) {
      this.$router.push(`/album/${id}`)
    }
  },
}
</script>
<template>
  <b-container fluid="lg" class="d-flex flex-column mt-2">
    <b-breadcrumb>
      <b-breadcrumb-item to="/me">Hem</b-breadcrumb-item>
      <b-breadcrumb-item to="/me/topartists">Topp artister</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ artistName }}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="d-flex flex-column flex-wrap mt-3" v-if="artistData">
      <b-row style="min-width:100%;" fluid="lg">
        <b-col class="d-flex flex-column gap-2" md="3">
          <div class="w-100 d-flex flex-column justify-content-center align-items-center"
            style="border-bottom: 1px solid rgb(201, 201, 201);">
            <div class="img-wrapper">
              <img :src="artistData.images[0].url" v-if="artistData.images.length > 0" class="avatar" alt="">
              <img src="https://do.lolwot.com/wp-content/uploads/2015/08/20-of-the-funniest-dog-photos-of-all-time-16.jpg"
                v-else class="avatar" alt="">
            </div>
            <h4>{{ artistData.name }}</h4>
            <p>{{ artistData.followers.total }} Följare</p>
          </div>
          <h5 class="text-left">Mest populära låtar i Sverige</h5>
          <ul>
            <li v-for="(tracks, index) in artistTopTracks">
              {{ index + 1 }}. {{ tracks.name }}
            </li>
          </ul>
        </b-col>
        <b-col md="9">
          <h4>Album</h4>
          <ul class="d-flex flex-row flex-wrap gap-3 mt-3" v-if="artistAlbums">
            <li v-for="albums in artistAlbums"
              class="top-artists justify-content-center align-items-center d-flex gap-2 flex-column"
              @click="goToAlbum(albums.id)">
              <span v-for="(img, index) in albums.images">
                <img :src="img.url" v-if="index === 1">
              </span>
              <p class="text-center">{{ albums.name }}</p>
            </li>
          </ul>
          <div v-else class="d-flex justify-content-center align-content-center"><b-spinner
              label="Loading..."></b-spinner>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
