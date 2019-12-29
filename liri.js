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

// CONCERT SEARCH =========================================================== //

if (liriSearch === "concert-this") {

    if (userSearch) {
        searchTerms = getTerms(process.argv);
    }
    let query = "https://rest.bandsintown.com/artists/" + searchTerms + "/events?app_id=codingbootcamp";

    axios.get(query).then((response) => { 
        let concerts = response.data;
        console.log("LIRI found "+concerts.length+" events for "+searchTerms);
        
        // console.log(concerts);s

        for(concert of concerts) {
            console.log('\n==================================================');

            if (concert.venue.region) {
                console.log("\n"+concert.venue.city.toUpperCase()+", "+concert.venue.region.toUpperCase());
            } else {
                console.log("\n"+concert.venue.city.toUpperCase()+", "+concert.venue.country.toUpperCase());
            }
            console.log(concert.venue.name);
            console.log(moment(concert.datetime).format('MM/DD/YYYY'));
        }
    });

}

// SONG SEARCH =========================================================== //

else if (liriSearch === "spotify-this-song") {
    if (userSearch) {
        searchTerms = getTerms(process.argv);
    }

    spotify.search({ type: 'track', query: searchTerms }, (err, data) => {
        if (err) {
            return console.log(err);
        }
        let songInfo = data.tracks.items[0];
        console.log('\n');
        console.log("LIRI found the following information:");
        console.log('\n==================================================');
        console.log('Song: ' + songInfo.name);
        console.log('Artist: ' + songInfo.artists[0].name);
        console.log('Album: ' + songInfo.album.name);
        if (songInfo.preview_url) {
            console.log('Preview: ' + songInfo.preview_url);
        } else {
            console.log('Listen: '+songInfo.external_urls.spotify);
        }
        console.log('==================================================');
        console.log('\n');

    });

}

// MOVIE SEARCH =========================================================== //

else if (liriSearch === "movie-this") {
    if (userSearch) {
        searchTerms = getTerms(process.argv);
    }
    let query = "http://www.omdbapi.com/?apikey=trilogy&t="+searchTerms;
    axios.get(query).then((response) => {
        let movie = response.data;
        console.log('\n');
        console.log("LIRI found the following information:");
        console.log('\n==================================================');
        console.log(movie.Title.toUpperCase());
        console.log('\n');
        console.log('Release year: '+movie.Year);
        console.log('IMDB Rating: '+movie.imdbRating);
        console.log('Rotten Tomatoes Rating: '+movie.Metascore);
        console.log('Countries: '+movie.Country);
        console.log('Language(s): '+movie.Language);
        console.log('\n');
        console.log("Plot:\n"+movie.Plot);
        console.log('\n');
        console.log("Starring: \n"+movie.Actors);
        console.log('==================================================');
        console.log('\n');

    });

}

// DO WHAT IT SAYS =========================================================== //

else if (liriSearch === "do-what-it-says") {
    fs.readFile('random.txt','utf8', function(err, data) {
        let commands = data.split('\n');
        let randIndex = Math.floor(Math.random() * commands.length);
        let theCommand = commands[randIndex].split(',');
        var subSearch = theCommand[0];
        searchTerms = theCommand[1];
        console.log(subSearch);
    });
}

// Get search terms from process.argv and concatenate them together into a string
function getTerms(arr) {
    arr.splice(0,3);
    return arr.join(' ');
}