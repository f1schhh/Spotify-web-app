<script>
import SpotifyWebApi from 'spotify-web-api-js';
export default {
  data() {
    return {
      topArtists: null,
      artistid: this.artistId,
      spotifyApi: new SpotifyWebApi()
    }
  },
  created() {
    this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
    this.getTopArtists();
    console.log(this.artistid)
  },
  methods: {
    async getTopArtists() {
      this.$Progress.start()
      const topArtistsData = await this.spotifyApi.getMyTopArtists();
      this.topArtists = topArtistsData.items;
      this.$Progress.finish()
    },
    goToArtist(id) {
      this.$router.push(`/artist/${id}`)
    }
  },
}
</script>
<template>
  <div class="w-100">
    <h4>Dina toppartister</h4>
    <ul class="d-flex flex-row flex-wrap gap-3 mt-3" v-if="topArtists">
      <li v-for="artist in topArtists" class="top-artists d-flex flex-column" @click="goToArtist(artist.id)">
        <img :src="artist.images[1].url" class="img-fluid">
        <p class="text-center mt-3">{{ artist.name }}</p>
      </li>
    </ul>
    <div v-else class="d-flex justify-content-center align-content-center"><b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
</template>
<style>
ul {
  list-style-type: none !important;
}

.top-artists {
  border: 1px solid #dbdbdb;
  padding: 0.2rem;
  cursor: pointer;
  flex: 1 0 20%;
}
</style>
