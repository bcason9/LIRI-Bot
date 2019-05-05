require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var fs = require("fs");
var moment = require("moment");


let axios = require("axios");
let userFunction = process.argv[2];
var userQuery = process.argv.slice(3).join("+");

/*
var nodeArgs = process.argv;
for (var i = 3; i < nodeArgs.length; i++) {

    let nodeString = nodeArgs[i].toString();

      userQuery = nodeString;
    
  }
*/

const spotifyThis = function() {
    var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

if (!userQuery) {
    userQuery = "The Sign Ace of Base"
}
spotify.search({ type: 'track', query: userQuery }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
        console.log("-------\n")
        console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong: " + data.tracks.items[0].name
        + "\nURL: " + data.tracks.items[0].external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name)
    }
)};

const bandsInTown = function() {
    
    axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp").then(
        function(response) {
            
            userQuery = process.argv.slice(3).join(" ")

            console.log("-------\nUpcoming shows for " + userQuery + "...\n-------")
            for (i=0; i<5; i++) {
               // let showDate = moment().format('MM/DD/YYYY')
               let time = moment(response.data[i].datetime).format('DD/MM/YYYY')
                console.log(response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city 
                + ", " + response.data[i].venue.country + "\nDate: " + time)
                console.log("\n-------\n")
            }
        }
    );
}

const movieThis = function() {

    if (!userQuery) {
        userQuery= "Mr. Nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy").then(
    function(response) {
    console.log("-------\n");
    console.log("Title: " + response.data.Title + "\nRelease year: " + response.data.Year
    + "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes: " + response.data.Ratings[1].Value
    + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot
    + "\nActors: " + response.data.Actors);
  });
};

const readThis = function() {
    fs.readFile("../random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

       // console.log(data);
        userQuery = data;
        spotifyThis(userQuery);
    })
}

function userPrompt(userFunction) {
    switch(userFunction) {
        case "spotify-this":
        spotifyThis();
        break;
        case "concert-this":
        bandsInTown();
        break;
        case "movie-this":
        movieThis();
        break;
        case "do-what-it-says":
        readThis();
        break;
        default: console.log("I don't understand...");
    }

}   

userPrompt(userFunction);