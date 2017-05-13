function drawBoard(canvas, board, boardHeight) {
  tileSize = boardHeight/8;
  var context=canvas.getContext("2d");
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
