require("dotenv").config();
const keys = require("./keys.js");
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const SpotifyAPI = require('node-spotify-api');
const spotify = new SpotifyAPI(keys.spotify);

var query;
var searchTerms;
var userSearch = true;

/* concert-this

spotify-this-song

movie-this

do-what-it-says */

// console.log(process.argv);

var liriSearch = process.argv[2];

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

// RUN THE SEARCH =========================================================== //
if (liriSearch === "do-what-it-says") {
    fs.readFile('random.txt','utf8', function(err, data) {
        let commands = data.split('\n');
        let randIndex = Math.floor(Math.random() * commands.length);
        let theCommand = commands[randIndex].split(',');
        liriSearch = theCommand[0];
        searchTerms = theCommand[1];
        // console.log(subSearch);
        doSearch();
    });
} else {
    if (userSearch) {
        searchTerms = getTerms(process.argv);
    }
    doSearch();
}


// Get search terms from process.argv and concatenate them together into a string
function getTerms(arr) {
    arr.splice(0,3);
    return arr.join(' ');
}

function doSearch() {

    // CONCERT SEARCH =========================================================== //
    if (liriSearch === "concert-this") {

        query = "https://rest.bandsintown.com/artists/" + searchTerms + "/events?app_id=codingbootcamp";

        axios.get(query).then((response) => { 
            let concerts = response.data;
            let output = "\n\nLIRI found "+concerts.length+" events for "+searchTerms;
    
            for(concert of concerts) {
                output += '\n\n==================================================\n';
    
                if (concert.venue.region) {
                    output += "\n"+concert.venue.city.toUpperCase()+", "+concert.venue.region.toUpperCase();
                } else {
                    output += "\n"+concert.venue.city.toUpperCase()+", "+concert.venue.country.toUpperCase();
                }
                output += "\n"+concert.venue.name;
                output += "\n"+moment(concert.datetime).format('MM/DD/YYYY');
            }

            output += '\n\n==================================================';

            logSearch(output);
        });    
    }

    // SONG SEARCH =========================================================== //
    else if (liriSearch === "spotify-this-song") {
        spotify.search({ type: 'track', query: searchTerms }, (err, data) => {
            if (err) {
                return console.log(err);
            }
            let songInfo = data.tracks.items[0];
            let output = '\n\nLIRI found the following information:';
            output += '\n\n==================================================';
            output += '\nSong: ' + songInfo.name;
            output += '\nArtist: ' + songInfo.artists[0].name;
            output += '\nAlbum: ' + songInfo.album.name;
            if (songInfo.preview_url) {
                output += '\nPreview: ' + songInfo.preview_url;
            } else {
                output += '\nListen: '+songInfo.external_urls.spotify;
            }
            output += '\n==================================================\n';

            logSearch(output);
    
        });
    }

    // MOVIE SEARCH =========================================================== //
    else if (liriSearch === "movie-this") {

        query = "http://www.omdbapi.com/?apikey=trilogy&t="+searchTerms;

        axios.get(query).then((response) => {
            let movie = response.data;
            let output = '\n\nLIRI found the following information:';
            output += '\n\n==================================================';
            output += '\n'+movie.Title.toUpperCase();
            output += '\nRelease year: '+movie.Year;
            output += '\n\nIMDB Rating: '+movie.imdbRating;
            output += '\nRotten Tomatoes Rating: '+movie.Metascore;
            output += '\n\nCountries: '+movie.Country;
            output += '\nLanguage(s): '+movie.Language;
            output += '\n\nPlot:\n'+movie.Plot;
            output += '\n\nStarring: \n'+movie.Actors;
            output += '\n==================================================\n';

            logSearch(output);
    
        });
    }
    
}

function logSearch(output) {
    console.log(output);
    let fileLog = '\n'+moment().format('YYYY-MM-DD HH:mm:ss');
    fileLog += " | node liri.js "+liriSearch+" "+searchTerms+"\n\n";
    fileLog += "- - -";
    fileLog += output+"\n\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n";
    fs.appendFile('log.txt',fileLog,(err) => {
        if (err) console.log(err);
    });
}