// spotifyService.js
import axios from 'axios';
import querystring from 'query-string';
import SpotifyWebApi from 'spotify-web-api-js';

const clientId = 'YOUR CLIENT ID';
const redirectUri = 'http://localhost:5173/callback'; // Change this to your actual redirect URI

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const getAuthLink = () => {
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email user-top-read user-library-read';
  const authorizationUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'token',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state
  });
  ;
  return authorizationUrl;
}
export const getUser = async () => {
  try {
    let spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(localStorage.getItem('spotifyAccessToken'));

    const data = await spotifyApi.getMe();
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.setItem('spotifyAccessToken', '');
      return false;
    } else {
      return false;
    }
  }
}
export function isTokenExpired() {
  const expirationTime = localStorage.getItem('tokenExpiration');
  return expirationTime && Date.now() > expirationTime;
}

// audioPlayer.js
let playingSongId = null;
const audio = new Audio();

function playSong(songurl, songId) {
  if (isSongPlaying(songId)) {
    audio.pause();
    playingSongId = null;
  } else {
    audio.src = songurl;
    audio.play();
    playingSongId = songId;
    setTimeout(() => {
      playingSongId = null;
    }, 30000);
  }
}

function isSongPlaying(songId) {
  console.log(playingSongId)
  console.log(songId)
  return playingSongId === songId;
}

export { playSong, isSongPlaying };
