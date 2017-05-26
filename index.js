var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port,function() {
  console.log('Server listening at port ' + port);
});

app.use(express.static(__dirname + '/public'));

var gamesetup = require('./gamesetup');
var checkers = require('./checkers');

var numUsers = 0;
var redLoggedIn = false;
var blueLoggedIn = false;

function Game() {
  this.boardHeight = 600;
  this.board = gamesetup.newBoard();
  this.turn = "red";
  gamesetup.initializePieces(this.board, this.boardHeight);
  this.heldPiece=null;
  this.heldX = -1;
  this.heldY = -1;
}

var game = new Game();

io.on('connection', function(client) {
  client.on('add user', function(username) {
    numUsers++;
    client.username = username;
    console.log(client.username + " has logged in.");
    console.log(numUsers + " users are connected.");
    if(!redLoggedIn) {
      client.color = "red";
      redLoggedIn = true;
    }
    else if(!blueLoggedIn) {
      client.color = "blue";
      blueLoggedIn = true;
    }
    else {
      client.color = "spectator";
    }
    console.log(client.username + " will play as " + client.color + ".");
    client.emit('newGame', game, client.color);
  });

  client.on('disconnect', function() {
    if(client.username) {
      numUsers--;
      console.log(client.username + " has logged out.")
      console.log(numUsers + " users are connected.");
      if(client.color === "red") {
        redLoggedIn = false;
      }
      else if(client.color === "blue") {
        blueLoggedIn = false;
      }
    }
  });

  client.on('click', function(e) {
    var grab = checkers.grabPiece(game.board, game.turn, client.color, game.heldPiece, game.heldX, game.heldY, e);
    game.heldPiece = grab.piece;
    game.heldX = grab.x;
    game.heldY = grab.y;
  });

  client.on('mouseMove', function(e) {
    if(game.heldPiece!=null && game.turn == client.color){
      game.heldPiece.xPos = e.x;
      game.heldPiece.yPos = e.y;
      io.emit('sync', game.board);
    }
  });

});
