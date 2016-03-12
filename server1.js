var express = require('express');
server = express();
//var r = require("rethinkdbdash")();
var bodyParser = require("body-parser");
var r = require("rethinkdbdash")();
var shenans = [];


require("rethink-config")({
  "r": r,
  "database": "sentiment",
  "tables" : ["intake"]
});

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'fWidCnn7Cgq4U8z8XbRY8cQxY',
  consumer_secret: 'YFqE0nazMN5BUfN40qIErFZkZdJUU66URQmck4FOYwGMmPbrzO',
  access_token_key: '427060330-yodN6OuV7sbr01xNYMWCzzVQcTVKpPglrZceXJEc',
  access_token_secret: '4ledAAN9XaSDHe3uYiFx56eEdr0b1QlRoaZENl4UXDj7X'
});

var params = {screen_name: 'simistern'};

client.get('friends/ids', params, function(error, tweets, response){
 if (!error) {
   shenans = tweets;
   console.log("another one!");
  r.db("sentiment").table("intake").insert(tweets).then(function(result) {
    client.get('/users/lookup.json', shenans, function(error, userObjects, response){
      if (!error) {
        r.db("sentiment").table("intake").insert(userObjects).then(function(result) {
          console.log("IT WORKED AND SAVED! " + userObjects);
        });
        console.log("IT WORKED! " + userObjects);
      }
      else{
        console.log("Could not look up because " + JSON.stringify(error));
      }
    });
  //  console.log(JSON.stringify(result) + " " + JSON.stringify(shenans));
  })
 }
 else{
   console.log("Bad intake because " + JSON.stringify(error));
 }
});

/* GET ID's */



server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(express.static(__dirname + '/public'));

server.get("*", function(request, result){
  result.sendFile(__dirname + "/public/index.html");
})

var PORT = process.env.PORT || 3001;
server.listen(PORT);

console.log("Simisite is running on " + PORT);
