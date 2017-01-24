/* global createjs */

const Simulation = require('./simulation');


let stage;
let squares = {};
let boardSize = 100;
let gridSize = 50;

function generateGrid() {
  let square;

  let numSq = boardSize / gridSize;

  for(let r = 0; r < numSq; r++) {
    for(let c = 0; c < numSq; c++) {
      square = new createjs.Shape();

      square.graphics.beginStroke('#000');
      square.graphics.setStrokeStyle(1);
      square.snapToPixel = true;
      square.graphics.beginFill('#fff');

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
  // console.log(e.target.x + '_' + e.target.y);
  changeGridColor(e);
  stage.update();
}

function changeGridColor(e) {
  let current = squares[e.target.x + "_" + e.target.y];
  let color;

  if(current.state === 'off') {
    color = '#0072ff';
    current.state = 'on';
  } else {
    color = '#fff';
    current.state = 'off';
  }

  current.square.graphics.beginFill(color).drawRect(0, 0, gridSize, gridSize);
}

$(document).ready( () => {
  stage = new createjs.Stage("simCanvas");
  generateGrid();
  let simulation = new Simulation(stage, squares, gridSize, boardSize);

  window.stage = stage;
  window.s = simulation;
  window.sqs = squares;
});