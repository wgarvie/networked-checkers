function drawBoard(context, board, boardHeight) {
  tileSize = boardHeight/8;
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

function drawPieces(context,board) {
  for(y = 0; y < board.length; y++) {
    for(x=0; x < board.length; x++){
      if(board[y][x]!=null){
        drawPiece(context, board[y][x]);
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

function drawGameOver(context, boardHeight, gameOver) {
  tileSize = boardHeight/8;
  context.fillStyle= "#000000"
  context.fillRect(tileSize/2,(tileSize/2)*5,(tileSize/2)*14,(tileSize/2)*6)
  context.fillStyle = "#ffffff"
  var fontSize=tileSize
  context.font=fontSize +"px Impact";
  context.fillText(gameOver,(tileSize/2)*4,(tileSize/2)*8.5)
}
