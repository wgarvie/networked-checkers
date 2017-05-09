function Piece(color) {
  this.color = color
  this.xPos = 0
  this.yPos = 0
  this.king = false
}

function newBoard() {
  var board = new Array(8);
  for(var i = 0; i < board.length; i++) {
    board[i] = new Array(8);
  }
  for(y=0; y<board.length; y++){
    for(x=0; x<board.length; x++){
      if(y>=0 && y<=2 && (x+y) % 2 != 0)
        board[y][x] = new Piece("blue")
      else if(y>= 5 && y <= 7 && (x+y) % 2 != 0)
        board[y][x] = new Piece("red")
      else
        board[y][x] = null
    }
  }
  return board;
}

function initializePieces() {
  for(y = 0; y < board.length; y++) {
    for(x = 0; x < board[0].length; x++) {
      if(board[y][x] != null) {
        board[y][x].xPos = (tileSize/2)+(x*tileSize)
        board[y][x].yPos = (tileSize/2)+(y*tileSize)
      }
    }
  }
}

function printBoard(board) {
  console.log("board:")
  for(y = 0; y < board.length; y++) {
    var str = ""
    for(x = 0; x < board.length; x++){
      str += board[y][x] + " "
    }
    console.log(str)
  }
}
