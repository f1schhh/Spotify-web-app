import { createApp } from 'vue'
import VueProgressBar from '@aacassandra/vue3-progressbar'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import SpotifyWebApi from 'spotify-web-api-js';
import App from './App.vue'
import router from './router'

const app = createApp(App);

// Use VueProgressBar plugin for progress bar
app.use(VueProgressBar, {
  color: "#0d6efd",
  failedColor: 'red',
  thickness: '5px'
});


// Use Vue Router
app.use(router);

// Mount the app to the specified element
app.mount('#app');
