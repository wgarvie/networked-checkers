$(function() {

  var socket = io();
  var username = "";
  var $userNameInput = $('.login-screen__input');
  var $loginScreen = $('.login-screen');

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

});
