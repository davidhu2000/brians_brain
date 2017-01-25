/* global createjs */

import Simulation from './simulation';
import Grid from './grid';

let boardSize = 600;
let gridSize = 10;

$(document).ready( () => {
  let stage = new createjs.Stage("simCanvas");
  let grid = new Grid(stage, boardSize, gridSize);
  grid.generateGrid();
  let simulation = new Simulation(stage, grid.squares, grid.states, gridSize, boardSize);

  createjs.Ticker.setFPS(30);

  function tick(event) {
    if(createjs.Ticker.getPaused()) {
      console.log('ticking');
      simulation.updateBoard();
      stage.update(event);
    }
  }

  createjs.Ticker.addEventListener("tick", tick);

});
