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
  var lastMove = null;
  var gameOver = "";
  canvas.addEventListener('mousedown', grabPiece);
  canvas.addEventListener('mousemove', holdingPiece);
  canvas.addEventListener('mouseout', leaveBoard)
  canvas.addEventListener('mouseup', placePiece)

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
    if(gameOver != "")
      drawGameOver(context,boardHeight);
  }

  function grabPiece(e) {
    if(heldPiece == null) {
      for(y=0; y<board.length; y++){
        for(x=0; x<board.length; x++){
          if(board[y][x]!=null && board[y][x].color == turn && e.x>board[y][x].xPos-40 && e.x<board[y][x].xPos+40 && e.y>board[y][x].yPos-40 && e.y<board[y][x].yPos+40) {
            heldPiece = board[y][x];
            heldX = x;
            heldY = y;
          }
        }
      }
    }
  }

  function holdingPiece(e) {
    if(heldPiece!=null){
      heldPiece.xPos = e.x
      heldPiece.yPos = e.y
    }
  }

  function leaveBoard(e) {
    heldPiece = null
    heldX = -1
    heldY = -1
    initializePieces()
  }

  function placePiece(e) {
    if (heldPiece != null) {
      var kinged = false
      var dropX = Math.floor(e.x/tileSize)
      var dropY = Math.floor(e.y/tileSize)
      var validMoves = getValidMoves(turn, board, lastMove)
      if(validMoves.length == 0) {
        gameOver = turn + " can't move."
      }
      var move = null
      for(x = 0; x < validMoves.length; x++) {
        if(heldPiece == validMoves[x].piece && dropX == validMoves[x].newX && dropY == validMoves[x].newY) {
          move = validMoves[x]
        }
      }
      if(move != null) {
        board[dropY][dropX] = board[heldY][heldX]
        board[heldY][heldX] = null
        if(move.jumpX != -1) {
          board[move.jumpY][move.jumpX] = null
          checkWin()
        }
        if(!heldPiece.king && heldPiece.color=="red" && dropY==0){
          heldPiece.king=true
          kinged = true
        }
        else if(!heldPiece.king && heldPiece.color=="blue" && dropY==board.length-1){
          heldPiece.king=true
          kinged = true
        }
        if(kinged || move.jumpX == -1) {
          turn = turn == "red" ? "blue" : "red"
        }
        else if(!(move.jumpX != -1 && getJumps(board[dropY][dropX],dropX,dropY,board).length > 0)) {
          turn = turn == "red" ? "blue" : "red"
        }
        lastMove = move
      }
      heldPiece=null
      heldX = -1
      heldY = -1
      initializePieces()
    }
  }

  function initializePieces() {
    tileSize = boardHeight/8;
    for(y = 0; y < board.length; y++) {
      for(x = 0; x < board[0].length; x++) {
        if(board[y][x] != null) {
          board[y][x].xPos = (tileSize/2)+(x*tileSize)
          board[y][x].yPos = (tileSize/2)+(y*tileSize)
        }
      }
    }
  }

  function checkWin() {
    redExists = false
    blueExists = false
    for(y = 0; y < board.length && (!redExists || !blueExists); y++) {
      for(x = 0; x < board.length && (!redExists || !blueExists); x++) {
        if(board[y][x] != null && board[y][x].color == "red")
          redExists = true
        else if(board[y][x] != null && board[y][x].color == "blue")
          blueExists = true
      }
    }
    if(!redExists)
      gameOver = "Blue Wins"
    else if(!blueExists) {
      gameOver = "Red Wins"
    }
  }

});
