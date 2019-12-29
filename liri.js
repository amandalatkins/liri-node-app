require("dotenv").config();
const keys = require("./keys.js");
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const SpotifyAPI = require('node-spotify-api');
const spotify = new SpotifyAPI(keys.spotify);

var searchTerms;
var userSearch = true;

/* concert-this

spotify-this-song

movie-this

do-what-it-says */

console.log(process.argv);

const liriSearch = process.argv[2];

if (!liriSearch || (liriSearch !== "concert-this" && liriSearch !== "spotify-this-song" && liriSearch !== "movie-this" && liriSearch !== "do-what-it-says")) {
    return console.log('\n==================================================\nOops! You must supply a correct LIRI command:\n\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says\n==================================================\n');
}

if (!process.argv[3]) {
    // If the user doesn't provide any search terms, then set defaults:
    if (liriSearch === "concert-this") {
        searchTerms = "The Lone Bellow";
    } else if (liriSearch === "movie-this") {
        searchTerms = "mr nobody";
    } else if (liriSearch === "spotify-this-song") {
        searchTerms = "valerie";
    }
    userSearch = false;
}