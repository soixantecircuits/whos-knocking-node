var twitter = require('ntwitter');
var port = process.env.PORT || 5000;
var io = require('socket.io').listen(port);
var twit_feed = {};
var twit = new twitter({
  consumer_key: 'kbR7mokXfS5Fjlg5qTLyg',
  consumer_secret: 'YQ9OzzIXo3lLxWFOUcLq8bUrxyoDcOfYFo0aLuBoQ',
  access_token_key: '18630920-BJK0ZBcFBh12m3N2zDEmNHKWU9GA1PBNuJCxyBACc',
  access_token_secret: 'MoAFqF8RNpN1MpebMJZalXk1IDVN8V6FRM78a0E'
});

twit.stream('statuses/filter', {'track':'ringthebell'}, function(stream) {
  stream.on('data', function (data) {
  	io.sockets.emit('new_tweet', data);
  });
});
