$(function() {

  var socket = io();
  var username = "";
  var $userNameInput = $('.login-screen__input');
  var $loginScreen = $('.login-screen');
  var canvas = $('.game-canvas').get(0);
  var context = canvas.getContext('2d');
  var game;
  var color;

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
    game = serverGame;
    color = newColor;
    drawBoard(context, game.board, game.boardHeight);
    drawPieces(context, game.board);
  })



});
