// Load all the dependences and set them up if necessary
require("dotenv").config();
const keys = require("./keys.js");
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const SpotifyAPI = require('node-spotify-api');
const spotify = new SpotifyAPI(keys.spotify);

// Global variables for searching
var query;
var searchTerms;
var userSearch = true;

// Store the specific search command in liriSearch
var liriSearch = process.argv[2];

// Make sure user entered a valid search command
if (!liriSearch || (liriSearch !== "concert-this" && liriSearch !== "spotify-this-song" && liriSearch !== "movie-this" && liriSearch !== "do-what-it-says")) {
    // If not, exit the script and show the user a list of the correct search commands
    return console.log('\n==================================================\nOops! You must supply a correct LIRI command:\n\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says\n==================================================\n');
}

// Check to see if the user provided any search terms
if (!process.argv[3]) {
    // If the user doesn't provide any search terms, then set defaults:
    if (liriSearch === "concert-this") {
        searchTerms = "the lone bellow";
    } else if (liriSearch === "movie-this") {
        searchTerms = "mr nobody";
    } else if (liriSearch === "spotify-this-song") {
        searchTerms = "the sign ace of base";
    }
    // User did not search, so set this variable to false
    userSearch = false;
}

// RUN THE SEARCH =========================================================== //
// If user entered 'do-what-it-says'
if (liriSearch === "do-what-it-says") {

    // Open the random.txt file
    fs.readFile('random.txt','utf8', function(err, data) {

        // Split the data from random.txt by line break, store each line in commands array
        let commands = data.split('\n');

        // Select a random line from the commands array and split that line by the comma that separates the LIRI command and search terms
        let randIndex = Math.floor(Math.random() * commands.length);
        let theCommand = commands[randIndex].split(',');

        // Set the liriSearch and searchTerms global variables to the items parsed from random.txt
        liriSearch = theCommand[0];
        searchTerms = theCommand[1];

        // run the search
        doSearch();
    });
} else {
    // If the user provided search terms, run the getTerms function on process.argv
    if (userSearch) {
        searchTerms = getTerms(process.argv);
    }

    // run the search
    doSearch();
}


// Get search terms from process.argv and concatenate them together into a string
function getTerms(arr) {
    // remove the first three indicies as the search terms will always occur after
    arr.splice(0,3);
    return arr.join(' ');
}

function doSearch() {

    // CONCERT SEARCH =========================================================== //
    if (liriSearch === "concert-this") {

        // Setup BandsInTown API query URL
        query = "https://rest.bandsintown.com/artists/" + searchTerms + "/events?app_id="+keys.bandsKey;

        // Run the query using Axios
        axios.get(query).then((response) => { 

            let concerts = response.data;

            //use 'output' to store the text that will be displayed to the user
            let output = "\n\nLIRI found "+concerts.length+" events for "+searchTerms;
            
            // loop through each event in the concerts array
            for(concert of concerts) {
                output += '\n\n==================================================\n';
                
                // If the concert is in the US, let's just show the state rather than the country
                if (concert.venue.region) {
                    output += "\n"+concert.venue.city.toUpperCase()+", "+concert.venue.region.toUpperCase();
                } else {
                    // else we'll show the city and country
                    output += "\n"+concert.venue.city.toUpperCase()+", "+concert.venue.country.toUpperCase();
                }
                output += "\n"+concert.venue.name;

                // use moment to make the date pretty
                output += "\n"+moment(concert.datetime).format('MM/DD/YYYY');
            }

            output += '\n\n==================================================\n';

            //send the output to logSearch
            logSearch(output);
        });    
    }

    // SONG SEARCH =========================================================== //
    else if (liriSearch === "spotify-this-song") {

        spotify.search({ type: 'track', query: searchTerms }, (err, data) => {
            if (err) {
                return console.log(err);
            }
            // pull the very first track returned by the spotify api
            let songInfo = data.tracks.items[0];

            //use 'output' to store the text that will be displayed to the user
            let output = '\n\nLIRI found the following information:';
            output += '\n\n==================================================';
            output += '\nSong: ' + songInfo.name;
            output += '\nArtist: ' + songInfo.artists[0].name;
            output += '\nAlbum: ' + songInfo.album.name;

            // if the song has a preview_url, display it. otherwise use the spotify url.
            if (songInfo.preview_url) {
                output += '\nPreview: ' + songInfo.preview_url;
            } else {
                output += '\nListen: '+songInfo.external_urls.spotify;
            }
            output += '\n==================================================\n';

            //send the output to logSearch
            logSearch(output);
    
        });
    }

    // MOVIE SEARCH =========================================================== //
    else if (liriSearch === "movie-this") {
        // Setup the OMDB API query URL
        query = "http://www.omdbapi.com/?apikey="+keys.omdbKey+"&t="+searchTerms;

        // Run the query using Axios
        axios.get(query).then((response) => {

            let movie = response.data;

            //use 'output' to store the text that will be displayed to the user
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

            //send the output to logSearch
            logSearch(output);
    
        });
    }
    
}

function logSearch(output) {
    // Display the output to the user
    console.log(output);

    // 'fileLog' stores the text that will be added to log.txt

    // Add a date and time that the request was made
    let fileLog = '\n'+moment().format('YYYY-MM-DD HH:mm:ss');

    // Add the exact request
    fileLog += " | node liri.js "+liriSearch+" "+searchTerms+"\n\n";
    fileLog += "- - -";
    // Add the exact output LIRI displayed to the user
    fileLog += output+"\n\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n";

    // Append the data to log.txt
    fs.appendFile('log.txt',fileLog,(err) => {
        if (err) console.log(err);
    });
}