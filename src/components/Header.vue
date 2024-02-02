<script>
import { isTokenExpired } from '../../services/spotifyService';

export default {
  data() {
    return {
      getUser: null,
      isTokenExpired: false,
      searchInput: null,
      selected: null,
      searchCategories: [
        { value: null, text: 'Välj en kategori' },
        { value: 'album', text: 'Album' },
        { value: 'artist', text: 'Artist' },
        { value: 'track', text: 'Låt' },
      ]
    };
  },
  computed: {
    isDisabled() {
      return !this.searchInput || !this.selected
    }
  },
  watch: {
    '$route'() {
      this.isTokenExpired = isTokenExpired();
    }
  },
  created() {
    this.isTokenExpired = isTokenExpired();
  },
  methods: {
    async search() {
      this.$router.push('/search/' + this.selected + '/' + this.searchInput);
    },
    logout() {
      localStorage.removeItem('spotifyAccessToken');
      localStorage.removeItem('tokenExpiration');
      this.$router.push('/login')
    }
  },
};
</script>

<template>
  <b-container fluid="lg" class="mt-2 mb-3" style="border-bottom: 1px solid rgb(201, 201, 201);">
    <b-navbar toggleable="lg" type="white" variant="white">
      <b-navbar-brand href="#" class="fs-3">Webifiy 🎶</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" class="justify-content-between" is-nav>
        <b-navbar-nav class="fs-5 mt-1">
          <b-nav-item to="/me">🏠 Hem</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="gap-1" v-if="isTokenExpired === false">
          <b-nav-form class="gap-1">
            <b-form-input class="mr-sm-1" placeholder="Vad vill du söka? 🔎" v-model="searchInput"
              required></b-form-input>
            <b-form-select v-model="selected" :options="searchCategories" required></b-form-select>
            <b-button variant="primary" class="my-2 my-sm-0" type="submit" @click="search()"
              :disabled="isDisabled">Sök</b-button>
          </b-nav-form>
          <b-button size="m" class="my-2 my-sm-0" type="submit" @click="logout()">Logga ut</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>
<style>
@media screen and (max-width: 992px) {
  #nav-collapse {
    justify-content: flex-start !important;
  }
}
</style>
