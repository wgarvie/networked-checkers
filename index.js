var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port,function() {
  console.log('Server listening at port ' + port);
});

app.use(express.static(__dirname + '/public'));

var numUsers = 0;
var gamesetup = require('./public/gamesetup');

function GameServer() {
  this.board = gamesetup.newBoard();
  gamesetup.printBoard(this.board);
}

var gameServer = new GameServer();

io.on('connection', function(client) {
  client.on('add user', function(username) {
    numUsers++;
    client.username = username;
    console.log(client.username + " has logged in.");
  });

  client.on('disconnect', function() {
    numUsers--;
    console.log(client.username + " has logged out.")
    console.log(numUsers + " users are connected.");
  });

});
