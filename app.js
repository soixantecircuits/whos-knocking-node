var twitter = require('ntwitter');
var credentials = require('./credentials.js');
var http = require('http');
var port = process.env.PORT || 5000;

var httpServer = http.createServer(function (request, response) {
  request.addListener('end', function () {
            clientFiles.serve(request, response);
        });
}).listen(port);

var io = require('socket.io').listen(httpServer);

var new_tweet = {};

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});
//io.sockets.on('connection', function (socket) {
	t.stream(
	    'statuses/filter',
	    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
	    function(stream) {
	        stream.on('data', function(tweet) {
	            //console.log(tweet.text);
	            new_tweet = tweet.text;
 				console.log(tweet.text);
            	io.sockets.emit('new_tweet', new_tweet);
	        });
	        stream.on('error', function (response){
	        	console.log(response);
	        });
	        stream.on('end', function (response) {
				console.log(response);
		  	});
		  	stream.on('destroy', function (response) {
		    	console.log(response);
  			});
	});
//});