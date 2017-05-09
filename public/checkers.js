var c=document.getElementById("myCanvas");
var tileSize = c.height/8
var board = newBoard()
var lastMove=null
var turn="red"
var heldPiece=null
var heldX = -1
var heldY = -1
var gameOver =  ""
initializePieces()
c.addEventListener('mousemove', holdingPiece)
c.addEventListener('touchmove',holdingPiece)
c.addEventListener('mousedown', grabPiece)
c.addEventListener('touchstart',grabPiece)
c.addEventListener('mouseout', leaveBoard)
c.addEventListener('mouseup', placePiece)
c.addEventListener('touchend',placePiece)
requestAnimationFrame(mainLoop)

function drawBoard() {
  var context=c.getContext("2d");
  for (y = 0; y < board.length; y++) {
    for(x = 0; x < board[0].length; x++) {
      if(((x + y) % 2) == 0){
        context.fillStyle="#E6DD93";
      }
      else {
        context.fillStyle="#000000";
      }
      context.fillRect(x*tileSize,y*tileSize, tileSize, tileSize);
    }
  }
}

function drawGameOver() {
  var context = c.getContext("2d")
  context.fillStyle= "#000000"
  context.fillRect(tileSize/2,(tileSize/2)*5,(tileSize/2)*14,(tileSize/2)*6)
  context.fillStyle = "#ffffff"
  var fontSize=tileSize
  context.font=fontSize +"px Impact";
  context.fillText(gameOver,(tileSize/2)*4,(tileSize/2)*8.5)
}

function drawPieces(context) {
  var context=c.getContext("2d")
  for(y = 0; y < board.length; y++) {
    for(x=0; x<board.length; x++){
      if(board[y][x]!=null){
        drawPiece(context, board[y][x])
      }
    }
  }
}

function drawPiece(context, newPiece) {
  context.fillStyle = newPiece.color;
  context.beginPath();
  context.arc(newPiece.xPos,newPiece.yPos,(tileSize-10)/2,0,2*Math.PI);
  context.stroke();
  context.fill();
  if(newPiece.king){
    context.fillStyle = "white"
    fontSize = tileSize/2
    context.font=fontSize+"px Impact";
    context.fillText("K",newPiece.xPos-(tileSize/9),newPiece.yPos+(tileSize/5))
  }
}

function holdingPiece(e) {
  if(heldPiece!=null){
    heldPiece.xPos = e.x
    heldPiece.yPos = e.y
  }
}

function grabPiece(e) {
  if(heldPiece == null) {
    for(y=0; y<board.length; y++){
      for(x=0; x<board.length; x++){
        if(board[y][x]!=null && board[y][x].color == turn && e.x>board[y][x].xPos-40 && e.x<board[y][x].xPos+40 && e.y>board[y][x].yPos-40 && e.y<board[y][x].yPos+40) {
          heldPiece = board[y][x]
          heldX = x
          heldY = y
        }
      }
    }
  }
}

function leaveBoard(e) {
  heldPiece = null
  heldX = -1
  heldY = -1
  initializePieces()
}

function mainLoop() {
  drawBoard()
  drawPieces()
  if(gameOver != "")
    drawGameOver()
  requestAnimationFrame(mainLoop)
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
