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
var gameObjects = require('./gameobjects.js');
var board = gameObjects.newBoard();
gameObjects.printBoard(board);

io.on('connection', function(client) {
  numUsers++;
  console.log(numUsers + " users are connected.");
  client.on('add user', function(username) {
    client.username = username;
    console.log(client.username + " has logged in.");
  });

  client.on('disconnect', function() {
    numUsers--;
    console.log(client.username + " has logged out.")
    console.log(numUsers + " users are connected.");
  });

});
