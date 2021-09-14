import * as FileSystem from 'expo-file-system';

export const baseURL = `http://192.168.0.11/nihongo-idioms-backend-php`;
export const clientID = `207077854831-ncqrvt9c2u9s6dmgm4ppfijbrchv4kj7.apps.googleusercontent.com`;
export const cryptoKEY = 'showdoIrandeDaTtEbayou';
export const deepLink = 'nihongoidiomas://';
export const redirectURI = `${encodeURIComponent('https://localhost')}`;
export const startappID = `207556779`;
export const DIR_VOCABULARY = `${FileSystem.documentDirectory}vocabulary`;
export const DIR_SHADOWING = `${FileSystem.documentDirectory}shadowing`;
export const DB_NAME = `phrases`;
export const DIR_DB = `${FileSystem.documentDirectory}SQLite`;
export const firebaseConfig = {
  apiKey: 'AIzaSyDEXgA3fHmE6YavA76Pa7JgqYIVZs0aKro',
  authDomain: 'idiomas-1583445828072.firebaseapp.com',
  databaseURL: 'https://idiomas-1583445828072.firebaseio.com',
  projectId: 'idiomas-1583445828072',
  storageBucket: 'idiomas-1583445828072.appspot.com',
  messagingSenderId: '207077854831',
  appId: '1:207077854831:web:2aad3b87ce3781c7d9079a',
  measurementId: 'G-7W5GNSHXBK'
};
