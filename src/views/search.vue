<script>
import SpotifyWebApi from 'spotify-web-api-js';
import { getUser } from '../../services/spotifyService';

export default {
  data() {
    return {
      searchData: null,
      searchType: true,
      spotifyApi: new SpotifyWebApi(),
    }
  },
  async created() {
    if (await getUser()) {
      this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
      await this.getSearchData(this.$route.params.query, this.$route.params.category);
    } else {
      this.$router.push('/login');
    }
  },
  watch: {
    async '$route.params.category'(newCategory) {
      await this.getSearchData(this.$route.params.query, newCategory);
    },
    async '$route.params.query'(newQuery) {
      await this.getSearchData(newQuery, this.$route.params.category);
    }
  },
  methods: {
    async getSearchData(query, category) {
      try {
        this.$Progress.start()
        if (query === "null" || category === "null") {
          this.$router.push('/login');
        } else {
          const searchData = await this.spotifyApi.search(query, [category]);
          if (category === "album") {
            this.searchData = searchData.albums.items
            this.searchType = true;
          } else if (category === "track") {
            this.searchData = searchData.tracks.items
            this.searchType = false;
          } else if (category === "artist") {
            this.searchData = searchData.artists.items
            this.searchType = true;
          }
          console.log(searchData)
          this.$Progress.finish()
        }
      } catch {
        this.$Progress.fail()
      }
    },
  }
}
</script>
<template>
  <b-container fluid="lg" class="mt-2 d">
    <b-breadcrumb>
      <b-breadcrumb-item to="/me">Hem</b-breadcrumb-item>
      <b-breadcrumb-item active>Sök</b-breadcrumb-item>
      <b-breadcrumb-item
        active>{{ this.$route.params.category.charAt(0).toUpperCase() + this.$route.params.category.slice(1) }}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ this.$route.params.query }}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="d-flex flex-column flex-wrap mt-3" v-if="searchData">
      <h4>Sökresultat för {{ this.$route.params.query }}</h4>
      <b-row style="min-width:100%;">
        <b-col cols="10">
          <ul>
            <li v-for="results in searchData">
              <span v-for="(img, index) in results.images" v-if="searchType">
                <img :src="img.url" v-if="index === 2">
              </span>
              <p v-if="results.artists"> {{ results.artists[0].name }} - {{ results.name }}</p>
              <p v-else>{{ results.name }}</p>
            </li>
          </ul>
        </b-col>
      </b-row>
    </div>
    <div v-else class="d-flex justify-content-center align-content-center mt-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </b-container>
</template>
