<!-- Callback.vue -->
<template>
  <div>
    <h1>Callback Page</h1>
  </div>
</template>

<script>
import { getAuthLink } from '../../services/spotifyService';

export default {
  async mounted() {
    // Handle the callback logic here
    await this.handleCallback();
  },
  methods: {
    async handleCallback() {
      if (window.location.hash.includes('access_token')) {
        const hash = window.location.hash;
        const splithash = hash.split('&')[0]
        const token = splithash.split('=')[1]
        const expirationTime = Date.now() + 3600 * 1000;
        localStorage.setItem('spotifyAccessToken', token);
        localStorage.setItem('tokenExpiration', expirationTime);

        this.$router.push('/me');
      }

    },
  },
};
</script>
