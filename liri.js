// require file with stored environment variables
require("dotenv").config();

// import the 'keys.js' file for Spotify keys
var keys = require("./keys");

// spotify
var Spotify = require("node-spotify-api");

// request
var request = require("request");

// fs
var fs = require("fs");

// moment
var moment = require("moment");

// grab input
var mode = process.argv[2];
var input = process.argv.slice(3).join(" ");

// Spotify
var spotify = new Spotify(keys.spotify);

// divider to separate entries in log.txt
var divider =
  "\n------------------------------------------------------------\n\n";
// console.log(mode);
// console.log(input);

liri();

function liri() {
  if (mode === "concert-this") {
    concert();
  } else if (mode === "spotify-this-song") {
    song();
  } else if (mode === "movie-this") {
    movie();
  } else if (mode === "do-what-it-says") {
    what();
  } else if (!mode || mode === "help") {
    help();
  } else {
    console.log("I'm not sure what you mean");
  }
}

function concert() {
  // verify the concert function has been triggered
  // console.log("concert function");

  var URL = `https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`;

  request(URL, function(error, response, body) {
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);

    // parse JSON data
    var jsonData = JSON.parse(body)[0];

    // nice format for ouptut
    var concertData = `***  Concert  ***

Artist: ${jsonData.lineup}
Venue: ${jsonData.venue.name}
Location: ${jsonData.venue.city}
Date: ${moment(jsonData.datetime).format("MM/DD/YYYY")}
    `;
    // log the output to the console
    console.log("Concert data written to log");

    // write output to the log file
    fs.appendFile("log.txt", concertData + divider, function(err) {
      if (err) throw err;
      // console.log(concertData);
    });
  });
}

function song() {
  // console.log("spotify function");
  spotify
    .search({ type: "track", query: input })
    .then(function(response) {
      var raw = response.tracks.items[0];
      var songData = `***  Song  ***

Artist: ${raw.album.artists[0].name}
Track: ${raw.name}
Preview Link: ${raw.preview_url}
Album: ${raw.album.name}
      `;
      console.log("Song data written to log");
      fs.appendFile("log.txt", songData + divider);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function movie() {
  // console.log("movie function");
  if (!input) {
    input = "mr nobody";
  }

  var URL = `http://www.omdbapi.com/?t=${input}&apikey=28fabb12`;

  request(URL, function(error, response, body) {
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);

    // parse JSON data
    var jsonData = JSON.parse(body);

    // nice format for output
    var movieData = `***  Movie  ***

Title: ${jsonData.Title}
Year: ${jsonData.Year}
IMBD Rating: ${jsonData.Ratings[0].Value}
Rotten Tomatoes Rating: ${jsonData.Ratings[1].Value}
Country: ${jsonData.Country}
Language: ${jsonData.Language}
Plot: ${jsonData.Plot}
Actors: ${jsonData.Actors}
    `;
    // log output to the console
    console.log("Movie data written to log");

    // write output to the log file
    fs.appendFile("log.txt", movieData + divider, function(err) {
      if (err) throw err;
      // console.log(movieData);
    });
  });
}

function what() {
  console.log("what function");
  fs.readFile("random.txt", "utf-8", function(err, data) {
    if (err) {
      throw err;
    }
    contents = data.split(" ");
    console.log(contents);
    mode = contents[0];
    console.log("mode: " + mode);
    input = contents.slice(1).join(" ");
    console.log("input: " + input);
    if (mode === "concert-this") {
      concert();
    } else if (mode === "spotify-this-song") {
      song();
    } else if (mode === "movie-this") {
      movie();
    }
  });
}

function help() {
  fs.readFile("README.md", "utf-8", function(err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
}
// console.log('help');
