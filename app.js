var twitter = require('ntwitter');
var ts = require('twitter-stream');

try {
    var credentials = require('./credentials.js');
} catch (err) {
    console.log("Error:", err);
    console.log("===> Using environmental credentials.");
    if (process.env.CONSUMER_KEY !== "") {
        var credentials = {
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token_key: process.env.ACCESS_TOKEN_KEY,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,
            name: process.env.NAME,
            mdp: process.env.PASS,
        };
    } else {
        exit("no creds");
    }
}

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

io.configure(function() {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

var port = process.env.PORT || 5000;
var nTwitterCount = 0;

server.listen(port);

app.get('/', function(req, res) {
    //res.sendfile(__dirname + '/index.html');
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Ring the Bell\n' + nTwitterCount);
});

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

var stream = ts.connect({
  screen_name: credentials.name,
  password: credentials.mdp,
  action: 'filter',
  params: {track: ['Soixantecircuits','#ringthebell']}
});

stream.on('status', function(status) {
        nTwitterCount++;
        console.log(status.text);
        io.sockets.emit('new_tweet', status.text);
});
//Handling error
stream.on('error', function(error) {
  console.error(error);
});
/*

t.stream('statuses/filter', {
    track: ['love','boy']
}, function(stream) {
    stream.on('data', function(tweet) {
        //console.log(tweet.text);
        nTwitterCount++;
        //new_tweet = tweet.text;
        console.log(tweet.text);
        io.sockets.emit('new_tweet', tweet);
    });
    stream.on('error', function(response) {
        console.log(response);
    });
    stream.on('end', function(response) {
        console.log(response);
    });
    stream.on('destroy', function(response) {
        console.log(response);
    });
});*/