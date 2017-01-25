/* global createjs */

class Grid {
  constructor(stage, boardSize, gridSize) {
    this.stage = stage;
    this.squares = {};
    this.states = {};
    this.boardSize = boardSize;
    this.gridSize = gridSize;

    this.handleClick = this.handleClick.bind(this);
  }

  generateGrid() {
    let square;

    let numSq = this.boardSize / this.gridSize;

    for(let r = 0; r < numSq; r++) {
      for(let c = 0; c < numSq; c++) {
        square = new createjs.Shape();

        square.graphics.beginStroke('#333');
        square.graphics.setStrokeStyle(1);
        square.snapToPixel = true;
        square.graphics.beginFill('#000');

        square.graphics.drawRect(0, 0, this.gridSize, this.gridSize);
        square.x = this.gridSize * c;
        square.y = this.gridSize * r;
        square.addEventListener("click", this.handleClick);

        this.stage.addChild(square);

        let id = square.x + "_" + square.y;
        this.squares[id] = square;

        this.states[id] = {
          state: 'off',
          pos: id
        };
        // console.log(squares);
      }
    }
    this.stage.update();
  }

  handleClick(e) {
    this.changeGridColor(e);
    this.stage.update();
  }

  changeGridColor(e) {
    let id = e.target.x + "_" + e.target.y;
    let currentSq = this.squares[id];
    let currentState = this.states[id];
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

    currentSq.graphics.beginFill(color).drawRect(0, 0, this.gridSize, this.gridSize);
  }
}

export default Grid;
