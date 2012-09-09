var twitter = require('ntwitter');
var credentials = require('./credentials.js');
var http = require('http');
var port = process.env.PORT || 5000;

var nTwitterCount = 0;

var httpServer = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Ring the Bell\n'+nTwitterCount);
}).listen(port);

var io = require('socket.io').listen(httpServer);

var new_tweet = {};

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});
t.stream(
    'statuses/filter',
    { track: ['soixantecircuits', 'ringthebell'] },
    function(stream) {
        stream.on('data', function(tweet) {
            //console.log(tweet.text);
            nTwitterCount++;
            //new_tweet = tweet.text;
			console.log(tweet);
        	io.sockets.emit('new_tweet', tweet);
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