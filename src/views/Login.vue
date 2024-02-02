<!-- Login.vue -->
<template>
  <b-container fluid="lg" class="mt-2 d-flex justify-content-center">
    <b-row>
      <b-col class="d-flex flex-column">
        <h2>Logga in för att kingla</h2>
        <p>Du måste logga in för att ta reda på allt gott på denna plattform 🎶 🎹 🎧</p>
        <b-button variant="success" @click="login">Logga in</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getAuthLink, isTokenExpired } from '../../services/spotifyService';


export default {
  data() {
    return { isLoggedIn: isTokenExpired() }
  },
  created() {
    if (this.isLoggedIn === false) {
      this.$router.push('/me');
    }
    console.log(isTokenExpired())
  },
  methods: {
    async initializeUser() {
      await this.fetchUser();
    },

    async fetchUser() {
      try {
        await getUser();
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    },
    login() {
      const authorizationUrl = getAuthLink();
      window.location.href = authorizationUrl;
    },
  },
};
</script>
