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
var moves = require('./moves');

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
  this.gameOver = "";
  this.lastMove = null;
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

  client.on('mouseDown', function(e) {
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

  client.on('mouseUp', function(e) {
    if(game.heldPiece != null && game.turn == client.color) {
      placePiece(e);
      gamesetup.initializePieces(game.board, game.boardHeight);
      io.emit('sync', game.board);
    }
  });

  client.on('mouseOut', function(e) {
    if(game.heldPiece != null && game.turn == client.color) {
      game.heldPiece = null;
      game.heldX = -1;
      game.heldY = -1;
      gamesetup.initializePieces(game.board, game.boardHeight);
      io.emit('sync', game.board);
    }
  });

});

function placePiece(e) {
  var tileSize = game.boardHeight / 8;
  var kinged = false;
  var dropX = Math.floor(e.x/tileSize);
  var dropY = Math.floor(e.y/tileSize);
  var validMoves = moves.getValidMoves(game.turn, game.board, game.lastMove);
  if(validMoves.length == 0) {
    game.gameOver = game.turn + " can't move.";
  }
  var move = null
  for(x = 0; x < validMoves.length; x++) {
    if(game.heldPiece == validMoves[x].piece && dropX == validMoves[x].newX && dropY == validMoves[x].newY) {
      move = validMoves[x]
    }
  }
  if(move != null) {
    game.board[dropY][dropX] = game.board[game.heldY][game.heldX];
    game.board[game.heldY][game.heldX] = null;
    if(move.jumpX != -1) {
      game.board[move.jumpY][move.jumpX] = null;
      game.gameOver = checkers.checkWin(game.board);
    }
    if(!game.heldPiece.king && game.heldPiece.color=="red" && dropY==0){
      game.heldPiece.king=true;
      kinged = true;
    }
    else if(!game.heldPiece.king && game.heldPiece.color=="blue" && dropY==game.board.length-1){
      game.heldPiece.king=true;
      kinged = true;
    }
    if(kinged || move.jumpX == -1) {
      game.turn = game.turn == "red" ? "blue" : "red";
    }
    else if(!(move.jumpX != -1 && moves.getJumps(game.board[dropY][dropX],dropX,dropY,game.board).length > 0)) {
      game.turn = game.turn == "red" ? "blue" : "red";
    }
    game.lastMove = move;
  }
  game.heldPiece=null;
  game.heldX = -1;
  game.heldY = -1;
  if(game.gameOver != null) {
    io.emit('gameOver', game.gameOver);
  }
}
