const _ = require('lodash');

function Simulation(stage, squares, gridSize, boardSize) {
  this.squares = squares;
  this.stage = stage;
  this.boardSize = boardSize;
  this.gridSize = gridSize;
  this.deltas = [
    [ 0, -1],
    [ 1, -1],
    [ 1,  0],
    [ 1,  1],
    [ 0,  1],
    [-1,  1],
    [-1,  0],
    [-1, -1]
  ];
}

Simulation.prototype.findNeighborIds = function(pos) {
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
};

Simulation.prototype.countNumberOfOns = function(ids) {
  return ids.filter( id => {
    return this.squares[id].state === 'on';
  }).length;
};

Simulation.prototype.nextState = function(sq) {
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
};

Simulation.prototype.updateAllStates = function() {

  let squaresDup = _.cloneDeep(this.squares);
  Object.keys(this.squares).forEach( id => this.nextState(squaresDup[id]) );
  Object.keys(this.squares).forEach( id => {
    this.squares[id].state = squaresDup[id].state;
  });
};

Simulation.prototype.updateSquareColor = function(sq) {
  let color;
  if(sq.state === 'off') {
    color = '#000';
  } else if(sq.state === 'dying'){
    color = 'red';
  } else {
    color = '#fff';
  }
  sq.square.graphics.clear();
  sq.square.graphics.beginStroke('#333');
  sq.square.graphics.setStrokeStyle(1);
  sq.square.snapToPixel = true;
  sq.square.graphics.beginFill(color);

  sq.square.graphics.drawRect(0, 0, this.gridSize, this.gridSize);
};

Simulation.prototype.updateAllSquareColors = function() {
  Object.keys(this.squares).forEach( id => this.updateSquareColor(this.squares[id]) );
};

Simulation.prototype.updateBoard = function() {
  performance.mark('begin-state-change');
  this.updateAllStates();
  performance.mark('end-state-change');

  performance.mark('start-color-change');
  this.updateAllSquareColors();
  performance.mark('end-color-change');

  this.stage.update();

  performance.measure('stateChange', 'begin-state-change', 'end-state-change');
  performance.measure('colorChange', 'start-color-change', 'end-color-change');

  let stateChange = performance.getEntriesByName('stateChange');
  let colorChange = performance.getEntriesByName('colorChange');

  let avgState = stateChange.reduce( (total, measure) => {
    return total + measure.duration;
  }, 0) / stateChange.length;

  let avgColor = colorChange.reduce( (total, measure) => {
    return total + measure.duration;
  }, 0) / colorChange.length;

  avgState = Math.round(avgState * 1000) / 1000;
  avgColor = Math.round(avgColor * 1000) / 1000;

  console.log('Avg State Change: ', avgState, 'ms');
  console.log('Avg Color Change: ', avgColor, 'ms');

};


module.exports = Simulation;
