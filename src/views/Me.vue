<!-- Stats.vue -->
<script>
import SpotifyWebApi from 'spotify-web-api-js';
import { isTokenExpired } from '../../services/spotifyService.js';

export default {
  data() {
    return {
      userData: null,
      spotifyApi: new SpotifyWebApi(),
      isLoggedIn: !isTokenExpired()
    }
  },
  async created() {
    this.spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));
    this.getData();
  },
  methods: {
    async getData() {
      const user = await this.spotifyApi.getMe();
      console.log(user)
      this.userData = user;
    },
  }
}
</script>
<template>
  <b-container fluid="lg" class="mt-2">
    <div class="d-flex flex-column flex-wrap mt-3" v-if="userData">
      <b-row fluid="lg" class="me-row gap-3">
        <b-col class="d-flex flex-column align-items-center px-2" lg="2">
          <div class="img-wrapper">
            <img v-bind:src="userData.images[0]" v-if="userData.images.length > 0" class="avatar" alt="">
            <img src="https://do.lolwot.com/wp-content/uploads/2015/08/20-of-the-funniest-dog-photos-of-all-time-16.jpg"
              v-else class="avatar" alt="">
          </div>
          <h4>{{ userData.display_name }}</h4>
          <p v-if="userData.product === 'premium'">Premium användare</p>
          <p v-else>Vanlig användare</p>
          <b-list-group class="w-100">
            <router-link to="/me" :exact="true">
              <b-list-group-item :class="{ active: $route.path === '/me' }">Min profil</b-list-group-item>
            </router-link>
            <router-link to="/me/topsongs" :exact="true">
              <b-list-group-item :class="{ active: $route.path === '/me/topsongs' }">Topp låtar</b-list-group-item>
            </router-link>
            <router-link to="/me/topartists" :exact="true">
              <b-list-group-item :class="{ active: $route.path === '/me/topartists' }">Topp artister</b-list-group-item>
            </router-link>
            <router-link to="/me/savedTracks" :exact="true">
              <b-list-group-item :class="{ active: $route.path === '/me/savedTracks' }">Sparade låtar</b-list-group-item>
            </router-link>
          </b-list-group>
        </b-col>
        <b-col md="9" fluid="lg" class="border: 1px solid black !important">
          <div v-if="$route.path === '/me/' || $route.path === '/me'">
            <span class="fs-4">Tja och välkommen <b-badge>{{ userData.display_name }}</b-badge> ! 🔥 ✨</span>
            <p class="mt-3">Lorem Ipsum is simply dammy text of the printing and typesetting industry. Lorem Ipsum has
              been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. </p>
            <p>It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
              Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
          <RouterView />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<style>
a {
  text-decoration: none !important;
}

.me-row {
  min-width: 100%;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 0.1rem;
  object-fit: cover;
  display: inline-block;
  object-position: center;
  background-color: rgb(224, 223, 223);
}

.img-wrapper {
  width: 10rem;
  height: 10rem;
  max-width: 100%;
}

@media screen and(max-width: 670px) {
  .me-row {
    flex-direction: column !important;
    color: white !important;
  }
}
</style>
