$(function() {

  var socket = io();
  var username = "";
  var $userNameInput = $('.login-screen__input');
  var $loginScreen = $('.login-screen');
  var $gameCanvas = $('.game-canvas');

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

  socket.on('newGame', function(game) {
    console.log("Game Starting");
    drawBoard($gameCanvas.get(0), game.board, game.boardHeight);
  })

});
