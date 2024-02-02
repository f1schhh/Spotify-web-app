import { createRouter, createWebHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import Login from './views/Login.vue';
import Me from './views/Me.vue';
import Callback from './views/Callback.vue';
import topSongs from './views/topSongs.vue';
import topArtists from './views/topArtists.vue';
import savedTracks from './views/savedTracks.vue';
import search from './views/search.vue';
import Artist from './views/Artist.vue';
import Album from './views/Album.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/me',
      component: Me,
      children: [ // Default child route for /me
        { path: 'topSongs', component: topSongs },
        { path: 'topArtists', component: topArtists },
        { path: 'savedTracks', component: savedTracks },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/search/:category/:query',
      component: search,
      meta: { requiresAuth: true },
    },
    {
      path: '/artist/:id',
      component: Artist,
      meta: { requiresAuth: true },
    },
    {
      path: '/album/:id',
      component: Album,
      meta: { requiresAuth: true },
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !isTokenExpired();
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    // Redirect to login if trying to access a protected route without authentication
    next('/login');
  } else {
    next();
  }
});

function isTokenExpired() {
  const expirationTime = localStorage.getItem('tokenExpiration');

  if (!expirationTime) {
    return true; // Consider it expired if there's no expiration time
  }

  const isExpired = Date.now() > expirationTime;

  return isExpired;
}


export default router;
