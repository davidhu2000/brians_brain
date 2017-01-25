/* global createjs */

const Simulation = require('./simulation');

let stage;
let squares = {};
let boardSize = 600;
let gridSize = 10;

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
      squares[id] = {
        square: square,
        state: 'off',
        pos: id
      };
    }
  }
  stage.update();
}

function handleClick(e) {
  changeGridColor(e);
  stage.update();
}

function changeGridColor(e) {
  let current = squares[e.target.x + "_" + e.target.y];
  let color;

  if(current.state === 'off') {
    color = '#fff';
    current.state = 'on';
  } else {
    color = '#000';
    current.state = 'off';
  }

  current.square.graphics.beginFill(color).drawRect(0, 0, gridSize, gridSize);
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
  let simulation = new Simulation(stage, squares, gridSize, boardSize);
  createjs.Ticker.addEventListener("tick", tick);


  // TODO: for testing
  window.stage = stage;
  window.s = simulation;
  window.sqs = squares;
});
