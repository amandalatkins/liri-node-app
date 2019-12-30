# LIRI Language Interpretator

## Summary

Welcome to LIRI, your own personal movie, concert, and song trivia treasure trove! With a few simple commands, LIRI can fetch information about any movie from the Open Movie Database, any song from Spotify, and tour information from any band using the Bands In Town API! LIRI also logs everything you search to a handy `log.txt` file should you need to review the information it has fetched for you.

## Prerequisites

- [NodeJS](https://nodejs.org/)
- [Spotify API Credentials](https://developer.spotify.com/)
- [BandsInTown API Credentials](https://www.artists.bandsintown.com/support/api-installation)
- [OMDB API Credentials](http://www.omdbapi.com/)

## Installing

Copy the repository link.

```
https://github.com/amandalatkins/liri-node-app.git
```

Clone the repository to your local development environment

```
git clone https://github.com/amandalatkins/liri-node-app.git
```

Navigate to the liri-node-app folder using the command prompt.

Run `npm install` to install all dependencies.

Create a file called `.env`. Within that file, enter the following code using your own API credentials:

```
SPOTIFY_ID=your-spotify-key
SPOTIFY_SECRET=your-spotify-secret
OMDB_KEY=your-omdb-key
BANDS_KEY=your-bandsintown-key
```

## Using LIRI

LIRI supports the following commands:

* ### concert-this

  This command will pull up a list of concerts for the supplied band. Example usage: 
  
  `node liri.js concert-this the lone bellow`

* ### spotify-this-song
  
  This command will retrieve song information from Spotify. Example usage:

  `node liri.js spotify-this-song do you believe in magic`

* ### movie-this

  This command will retrieve movie data from the Open Movie Database. Example usage:
  
  `node liri.js movie-this forrest gump`
* ### do-what-it-says

  This command will pull a random command from random.txt and run it. Example usage:
  
  `node liri.js do-what-it-says`

Enjoy this demonstration video to further understand how LIRI works:

[![LIRI.js Demonstration](https://img.youtube.com/vi/eHK4eqGRWdI/0.jpg)](https://www.youtube.com/watch?v=eHK4eqGRWdI "LIRI Demonstration")

## Code Snippets

The following snippet shows the function that opens `random.txt` and parses a random line from it for LIRI to use

```
    if (liriSearch === "do-what-it-says") {
        fs.readFile('random.txt','utf8', function(err, data) {
            let commands = data.split('\n');
            let randIndex = Math.floor(Math.random() * commands.length);
            let theCommand = commands[randIndex].split(',');
            liriSearch = theCommand[0];
            searchTerms = theCommand[1];
            doSearch();
        });
    }
```

## Built With

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [NodeJS](https://nodejs.org/)
* Node Packages:
    * [Moment](https://www.npmjs.com/package/moment)
    * [Axios](https://www.npmjs.com/package/axios)
    * [Node Spotify API](https://www.npmjs.com/package/node-spotify-api)
    * [DotEnv](https://www.npmjs.com/package/dotenv)

## Authors

Amanda Atkins
* [Portfolio](https://digitalrainstorm.com)
* [Github](https://github.com/amandalatkins)
* [LinkedIn](https://www.linkedin.com/in/amandalatkins)

See also the list of [contributors](https://github.com/amandalatkins/liri-node-app/contributors) who participated in this project.

## License

This project is licensed under the ISC License.