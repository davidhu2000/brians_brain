/* global createjs */

let stage;
let squares = [];
let boardSize = 800;
let gridSize = 50;

function generateGrid() {
  let square;

  let numSq = boardSize / gridSize;

  for(let c = 0; c < numSq; c++) {
    for(let r = 0; r < numSq; r++) {
      square = new createjs.Shape();

      square.graphics.beginStroke('#000');
      square.graphics.setStrokeStyle(1);
      square.snapToPixel = true;
      square.graphics.beginFill('#fff');

      square.graphics.drawRect(0, 0, gridSize, gridSize);
      square.x = gridSize * r;
      square.y = gridSize * c;
      square.addEventListener("click", handleClick);

      stage.addChild(square);

      let id = square.x + "_" + square.y;
      squares[id] = square;
    }
  }
  stage.update();
}

function handleClick(e) {
  console.log('clicked');
  console.log(e.target.x);
  console.log(e.target.y);
  var current = squares[e.target.x + "_" + e.target.y];
  console.log(current);
  current.graphics.beginFill('red').drawRect(0, 0, gridSize, gridSize);
  stage.update();
}

$(document).ready( () => {
  stage = new createjs.Stage("simCanvas");
  generateGrid();
});
