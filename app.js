var twitter = require('ntwitter');
var http = require('http');
var port = process.env.PORT || 5000;
var httpServer = http.createServer(function (request, response) {
  request.addListener('end', function () {
            clientFiles.serve(request, response);
        });
}).listen(port);
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket) {
  var twit = new twitter({
	  consumer_key: 'kbR7mokXfS5Fjlg5qTLyg',
	  consumer_secret: 'YQ9OzzIXo3lLxWFOUcLq8bUrxyoDcOfYFo0aLuBoQ',
	  access_token_key: '18630920-BJK0ZBcFBh12m3N2zDEmNHKWU9GA1PBNuJCxyBACc',
	  access_token_secret: 'MoAFqF8RNpN1MpebMJZalXk1IDVN8V6FRM78a0E'
  });
  twit.stream('statuses/filter', {'track':'ringthebell'}, 
	function(stream) {
	  stream.on('data', function (data) {
	  	socket.emit('new_tweet', data);
	  });
	  stream.on('end', function (response) {
	    // Handle a disconnection
	  });
	  stream.on('destroy', function (response) {
	    // Handle a 'silent' disconnection from Twitter, no end/error event fired
	  });
	});
});



