/* global createjs */

const Simulation = require('./simulation');

let stage;
let squares = {};
let states = {};
let boardSize = 600;
let gridSize = 10;

let deltas = [
  [ 0, -1],
  [ 1, -1],
  [ 1,  0],
  [ 1,  1],
  [ 0,  1],
  [-1,  1],
  [-1,  0],
  [-1, -1]
];

function findNeighborIds(pos) {
  let neighbors = [];
  pos = pos.split('_');
  let posX = parseInt(pos[0]);
  let posY = parseInt(pos[1]);

  let nX;
  let nY;

  deltas.forEach( delta => {
    nX = gridSize * delta[0] + posX;
    nY = gridSize * delta[1] + posY;

    if(nX >= 0 && nY >= 0 && nX < boardSize && nY < boardSize) {
      neighbors.push(nX + '_' + nY );
    }
  });

  return neighbors;
}

function generateGrid() {
  let square;

  let numSq = boardSize / gridSize;

  for(let r = 0; r < numSq; r++) {
    for(let c = 0; c < numSq; c++) {
      square = new createjs.Shape();

      square.graphics.beginStroke('#333');
      square.graphics.setStrokeStyle(1);
      square.snapToPixel = true;
      square.graphics.beginFill('#000');

      square.graphics.drawRect(0, 0, gridSize, gridSize);
      square.x = gridSize * c;
      square.y = gridSize * r;
      square.addEventListener("click", handleClick);

      stage.addChild(square);

      let id = square.x + "_" + square.y;
      squares[id] = square;
      
      states[id] = {
        state: 'off',
        pos: id
      };
      // console.log(squares);
    }
  }
  stage.update();
}

function handleClick(e) {
  changeGridColor(e);
  stage.update();
}

function changeGridColor(e) {
  let id = e.target.x + "_" + e.target.y;
  let currentSq = squares[id];
  let currentState = states[id];
  let color;

  if(currentState.state === 'off') {
    color = '#fff';
    currentState.state = 'on';
    // currentState.state = 'on';
  } else {
    color = '#000';
    currentState.state = 'off';
    // currentState.state = 'off';
  }

  currentSq.graphics.beginFill(color).drawRect(0, 0, gridSize, gridSize);
}


createjs.Ticker.setFPS(30);
function tick(event) {
  if(createjs.Ticker.getPaused()) {
    console.log('ticking');
    s.updateBoard();
    stage.update(event);
  }

}

$(document).ready( () => {
  stage = new createjs.Stage("simCanvas");
  generateGrid();
  let simulation = new Simulation(stage, squares, states, gridSize, boardSize);
  createjs.Ticker.addEventListener("tick", tick);


  // TODO: for testing
  window.stage = stage;
  window.s = simulation;
  window.sqs = squares;
});
