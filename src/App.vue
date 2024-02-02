<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <vue-progress-bar></vue-progress-bar>
  <Header />
  <main class="d-flex flex-grow-1">
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
</template>
