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

  document.getElementById('play-button').addEventListener('click', () => simulation.play() );
  document.getElementById('stop-button').addEventListener('click', () => simulation.stop() );
  document.getElementById('reset-button').addEventListener('click', () => simulation.reset() );

  document.addEventListener('keypress', (e) => {

    if(e.keyCode === 32) {
      createjs.Ticker.setPaused(
        !createjs.Ticker.getPaused()
      );
    }

    if(e.keyCode === 114) {
      simulation.reset();
    }
  });

  createjs.Ticker.addEventListener("tick", tick);

  window.grid = grid;
  window.stage = stage;
  window.simulation = simulation;
  window.sqs = grid.squares;

});
