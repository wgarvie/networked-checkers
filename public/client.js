$(function() {

  var INTERVAL=50;
  var socket = io();
  var username = "";
  var $userNameInput = $('.login-screen__input');
  var $loginScreen = $('.login-screen');
  var canvas = $('.game-canvas').get(0);
  var context = canvas.getContext('2d');
  var board;
  var boardHeight;
  var color;
  var heldPiece=null
  var heldX = -1
  var heldY = -1
  var turn;
  canvas.addEventListener('mousedown', function(e) { grabPiece(e, board, heldPiece, heldX, heldY, turn)});

  function cleanInput (input) {
    return $('<div/>').text(input.trim()).text();
  }

  $userNameInput.keydown(function (event) {
    if(event.which == 13) {
      setUserName();
    }
  });

  function setUserName() {
    username = cleanInput($userNameInput.val());
    if(username) {
      $loginScreen.fadeOut();
      socket.emit('add user', username);
    }
  }

  socket.on('newGame', function(serverGame, newColor) {
    //game = serverGame;
    board = serverGame.board;
    boardHeight = serverGame.boardHeight;
    color = newColor;
    turn = serverGame.turn;
    drawBoard(context, board, boardHeight);
    drawPieces(context, board);
    setInterval(function() {
      mainLoop();
    }, INTERVAL);
  })

  function mainLoop() {
    drawBoard(context, board, boardHeight);
    drawPieces(context, board);
  }

});
