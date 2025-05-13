var puzzleComplete = false;
var fenFromAPI = 'r3r1k1/p4ppp/2p2n2/1p6/3P1qb1/2NQR3/PPB2PP1/R1B3K1 w - - 5 18';
var puzzleMovesFromAPI;
var game = new Chess(fenFromAPI);
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')


var config = {
    draggable: true,
    position: fenFromAPI.split(' ')[0],
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
}
var board = Chessboard('board1', config);

resetGame();


function resetGame(){
    config.position = fenFromAPI.split(' ')[0];
    board = Chessboard('board1', config);
    puzzleComplete = false;
    game.reset();
    game.load(fenFromAPI);
    board.position(game.fen());
    board.orientation(fenFromAPI.split(' ')[1] === 'w' ? 'black' : 'white');
    puzzleMovesFromAPI = ['e3g3', 'e8e1', 'g1h2', 'e1c1', 'a1c1', 'f4h6', 'h2g1', 'h6c1'];
    setTimeout(function(){
        playEnemyMove();
    }, 350);
    updateStatus();
}
function playEnemyMove(){
    setTimeout(()=>{}, 150);
    var enemyMove;
    if(puzzleMovesFromAPI.length === 0){
        puzzleComplete = true;
        return;
    } else {
        enemyMove = puzzleMovesFromAPI.shift();
    }
    var move = game.move({
        from: enemyMove.substring(0, 2),
        to: enemyMove.substring(2, 4),
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    if(move === null){
        return 'snapback';
    }
    board.position(game.fen());
    updateStatus()
    
}
function onDragStart (source, piece, position, orientation) {
    updateStatus();
    if (puzzleComplete === true) {
        return false;
    }
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}
function onDrop (source, target){
    console.log(source+target);
    console.log(puzzleMovesFromAPI[0]);
    if(!((source+target) === puzzleMovesFromAPI[0])){
        return 'snapback';
    }
    puzzleMovesFromAPI.shift();
    var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
    
    });
    if(move === null){
        return 'snapback';
    }
    board.position(game.fen(), false);
    setTimeout(function(){
        playEnemyMove();
    }, 150);
    updateStatus()
}
function onSnapEnd () {
  board.position(game.fen())
}
function updateStatus () {
  var status = ''
if(puzzleMovesFromAPI.length === 0){
        status = 'Puzzle complete! You win!';
        puzzleComplete = true;
} else {
  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }
    status = moveColor + ' to move';
}
  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

