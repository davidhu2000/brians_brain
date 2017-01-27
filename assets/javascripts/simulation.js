/* global createjs */

class Simulation {

  constructor(stage, squares, states, gridSize, boardSize) {
    this.squares = squares;
    this.states = states;
    this.stage = stage;
    this.boardSize = boardSize;
    this.gridSize = gridSize;
    this.deltas = [
      [ 0, -1], [ 1, -1], [ 1,  0], [ 1,  1],
      [ 0,  1], [-1,  1], [-1,  0], [-1, -1]
    ];

    this.presets = {
      twinEyes:     ['290_270', '300_270'],
      theSpaceship: ['300_550', '310_550'],
      boomerang:    ['300_290', '300_320', '310_290', '310_320'],
      diamond:      ['290_270', '300_270', '290_280', '300_280']
    };

    this.clearBoard = this.clearBoard.bind(this);
  }

  findNeighborIds(pos) {
    let neighbors = [];
    pos = pos.split('_');
    let posX = parseInt(pos[0]);
    let posY = parseInt(pos[1]);

    let nX;
    let nY;

    this.deltas.forEach( delta => {
      nX = this.gridSize * delta[0] + posX;
      nY = this.gridSize * delta[1] + posY;

      if(nX >= 0 && nY >= 0 && nX < this.boardSize && nY < this.boardSize) {
        neighbors.push(nX + '_' + nY );
      }
    });

    return neighbors;
  }

  countNumberOfOns(ids) {
    return ids.filter( id => {
      return this.states[id].state === 'on';
    }).length;
  }

  nextState(sq) {
    if(sq.state === 'on') {
      sq.state = 'dying';
    } else if(sq.state === 'dying') {
      sq.state = 'off';
    } else {
      let neighborsIds = this.findNeighborIds(sq.pos);
      let numOns = this.countNumberOfOns(neighborsIds);
      if(numOns === 2) {
        sq.state = 'on';
      }
    }
  }

  updateAllStates() {

    let squaresDup = JSON.parse(JSON.stringify(this.states));
    Object.keys(this.states).forEach( id => this.nextState(squaresDup[id]) );
    Object.keys(this.squares).forEach( id => {
      this.states[id].state = squaresDup[id].state;
    });
  }

  updateSquareColor(id) {
    let state = this.states[id].state;
    let sq = this.squares[id];

    let color;
    if(state === 'off') {
      color = '#000';
    } else if(state === 'dying'){
      color = 'red';
    } else {
      color = '#fff';
    }
    sq.graphics.clear();
    sq.graphics.beginStroke('#333');
    sq.graphics.setStrokeStyle(1);
    sq.snapToPixel = true;
    sq.graphics.beginFill(color);

    sq.graphics.drawRect(0, 0, this.gridSize, this.gridSize);
  }

  updateAllSquareColors() {
    Object.keys(this.squares).forEach( id => this.updateSquareColor(id) );
  }

  updateBoard() {
    this.updateAllStates();
    this.updateAllSquareColors();
    this.stage.update();

    if(this.emptyBoard()) {
      this.stop();
    }
  }

  clearBoard() {
    Object.keys(this.states).forEach( id => {
      this.states[id].state = 'off';
    });
    this.updateBoard();
  }

  play() {
    createjs.Ticker.setPaused(true);
  }

  stop() {
    createjs.Ticker.setPaused(false);
  }

  reset() {
    this.clearBoard();
    this.stop();
  }

  emptyBoard() {
    return Object.values(this.states).every( s => s.state === 'off');
  }

  applyPreset(presetName) {
    this.reset();
    let preset = this.presets[presetName];
    preset.forEach( id => {
      this.states[id].state = 'on';
      this.updateSquareColor(id);
    });

    this.stage.update();
  }
}

export default Simulation;
