/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _simulation = __webpack_require__(1);
	
	var _simulation2 = _interopRequireDefault(_simulation);
	
	var _grid = __webpack_require__(2);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global createjs */
	
	var boardSize = 600;
	var gridSize = 10;
	
	$(document).ready(function () {
	  var stage = new createjs.Stage("simCanvas");
	  var grid = new _grid2.default(stage, boardSize, gridSize);
	  grid.generateGrid();
	  var simulation = new _simulation2.default(stage, grid.squares, grid.states, gridSize, boardSize);
	
	  document.getElementById('play-button').addEventListener('click', function () {
	    return simulation.play();
	  });
	  document.getElementById('stop-button').addEventListener('click', function () {
	    return simulation.stop();
	  });
	  document.getElementById('reset-button').addEventListener('click', function () {
	    return simulation.reset();
	  });
	
	  document.addEventListener('keypress', function (e) {
	
	    if (e.keyCode === 32) {
	      createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
	    }
	
	    if (e.keyCode === 114) {
	      simulation.reset();
	    }
	  });
	
	  createjs.Ticker.setFPS(30);
	
	  function tick(event) {
	    if (createjs.Ticker.getPaused()) {
	      simulation.updateBoard();
	      stage.update(event);
	    }
	  }
	
	  createjs.Ticker.addEventListener("tick", tick);
	
	  $('#preset-selector').change(function (e) {
	    simulation.applyPreset(e.target.value);
	  });
	
	  window.grid = grid;
	  window.stage = stage;
	  window.simulation = simulation;
	  window.sqs = grid.squares;
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global createjs */
	
	var Simulation = function () {
	  function Simulation(stage, squares, states, gridSize, boardSize) {
	    _classCallCheck(this, Simulation);
	
	    this.squares = squares;
	    this.states = states;
	    this.stage = stage;
	    this.boardSize = boardSize;
	    this.gridSize = gridSize;
	    this.deltas = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
	
	    this.presets = {
	      twinEyes: ['290_270', '300_270'],
	      theSpaceship: ['300_550', '310_550'],
	      boomerang: ['300_290', '300_320', '310_290', '310_320'],
	      diamond: ['290_270', '300_270', '290_280', '300_280']
	    };
	
	    this.clearBoard = this.clearBoard.bind(this);
	  }
	
	  _createClass(Simulation, [{
	    key: 'findNeighborIds',
	    value: function findNeighborIds(pos) {
	      var _this = this;
	
	      var neighbors = [];
	      pos = pos.split('_');
	      var posX = parseInt(pos[0]);
	      var posY = parseInt(pos[1]);
	
	      var nX = void 0;
	      var nY = void 0;
	
	      this.deltas.forEach(function (delta) {
	        nX = _this.gridSize * delta[0] + posX;
	        nY = _this.gridSize * delta[1] + posY;
	
	        if (nX >= 0 && nY >= 0 && nX < _this.boardSize && nY < _this.boardSize) {
	          neighbors.push(nX + '_' + nY);
	        }
	      });
	
	      return neighbors;
	    }
	  }, {
	    key: 'countNumberOfOns',
	    value: function countNumberOfOns(ids) {
	      var _this2 = this;
	
	      return ids.filter(function (id) {
	        return _this2.states[id].state === 'on';
	      }).length;
	    }
	  }, {
	    key: 'nextState',
	    value: function nextState(sq) {
	      // console.log(sq);
	      if (sq.state === 'on') {
	        sq.state = 'dying';
	      } else if (sq.state === 'dying') {
	        sq.state = 'off';
	      } else {
	        var neighborsIds = this.findNeighborIds(sq.pos);
	        var numOns = this.countNumberOfOns(neighborsIds);
	        if (numOns === 2) {
	          sq.state = 'on';
	        }
	      }
	    }
	  }, {
	    key: 'updateAllStates',
	    value: function updateAllStates() {
	      var _this3 = this;
	
	      // console.log('update');
	      // performance.mark('begin-deep-clone');
	      var squaresDup = JSON.parse(JSON.stringify(this.states));
	      // performance.mark('end-deep-clone');
	
	      // performance.mark('begin-next-state');
	      Object.keys(this.states).forEach(function (id) {
	        return _this3.nextState(squaresDup[id]);
	      });
	      // performance.mark('end-next-state');
	
	      // performance.mark('begin-next-state-update');
	      Object.keys(this.squares).forEach(function (id) {
	        _this3.states[id].state = squaresDup[id].state;
	      });
	      // performance.mark('end-next-state-update');
	
	      // performance.measure('deepClone', 'begin-deep-clone', 'end-deep-clone');
	      //
	      // let deepClone = performance.getEntriesByName('deepClone');
	      //
	      // let avgClone = deepClone.reduce( (total, measure) => {
	      //   return total + measure.duration;
	      // }, 0) / deepClone.length;
	      //
	      // performance.measure('nextState', 'begin-next-state', 'end-next-state');
	      //
	      // let nextState = performance.getEntriesByName('nextState');
	      //
	      // let avgState = nextState.reduce( (total, measure) => {
	      //   return total + measure.duration;
	      // }, 0) / nextState.length;
	      //
	      // performance.measure('nextUpdate', 'begin-next-state-update', 'end-next-state-update');
	      //
	      // let nextUpdate = performance.getEntriesByName('nextUpdate');
	      //
	      // let avgUpdate = nextUpdate.reduce( (total, measure) => {
	      //   return total + measure.duration;
	      // }, 0) / nextUpdate.length;
	      //
	      // console.log('Avg clone Change: ', avgClone, 'ms');
	      // console.log('Avg state Change: ', avgState, 'ms');
	      // console.log('Avg update Change: ', avgUpdate, 'ms');
	
	    }
	  }, {
	    key: 'updateSquareColor',
	    value: function updateSquareColor(id) {
	      var state = this.states[id].state;
	      var sq = this.squares[id];
	
	      var color = void 0;
	      if (state === 'off') {
	        color = '#000';
	      } else if (state === 'dying') {
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
	  }, {
	    key: 'updateAllSquareColors',
	    value: function updateAllSquareColors() {
	      var _this4 = this;
	
	      Object.keys(this.squares).forEach(function (id) {
	        return _this4.updateSquareColor(id);
	      });
	    }
	  }, {
	    key: 'updateBoard',
	    value: function updateBoard() {
	      // performance.mark('begin-state-change');
	      this.updateAllStates();
	      // performance.mark('end-state-change');
	
	      // performance.mark('start-color-change');
	      this.updateAllSquareColors();
	      // performance.mark('end-color-change');
	
	      this.stage.update();
	
	      // performance.measure('stateChange', 'begin-state-change', 'end-state-change');
	      // performance.measure('colorChange', 'start-color-change', 'end-color-change');
	      //
	      // let stateChange = performance.getEntriesByName('stateChange');
	      // let colorChange = performance.getEntriesByName('colorChange');
	      //
	      // let avgState = stateChange.reduce( (total, measure) => {
	      //   return total + measure.duration;
	      // }, 0) / stateChange.length;
	      //
	      // let avgColor = colorChange.reduce( (total, measure) => {
	      //   return total + measure.duration;
	      // }, 0) / colorChange.length;
	      //
	      // avgState = Math.round(avgState * 1000) / 1000;
	      // avgColor = Math.round(avgColor * 1000) / 1000;
	      //
	      // console.log('Avg State Change: ', avgState, 'ms');
	      // console.log('Avg Color Change: ', avgColor, 'ms');
	      if (this.emptyBoard()) {
	        this.stop();
	      }
	    }
	  }, {
	    key: 'clearBoard',
	    value: function clearBoard() {
	      var _this5 = this;
	
	      Object.keys(this.states).forEach(function (id) {
	        _this5.states[id].state = 'off';
	      });
	      this.updateBoard();
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      createjs.Ticker.setPaused(true);
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      createjs.Ticker.setPaused(false);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.clearBoard();
	      this.stop();
	    }
	  }, {
	    key: 'emptyBoard',
	    value: function emptyBoard() {
	      return Object.values(this.states).every(function (s) {
	        return s.state === 'off';
	      });
	    }
	  }, {
	    key: 'applyPreset',
	    value: function applyPreset(presetName) {
	      var _this6 = this;
	
	      this.reset();
	      var preset = this.presets[presetName];
	      preset.forEach(function (id) {
	        _this6.states[id].state = 'on';
	        _this6.updateSquareColor(id);
	      });
	
	      this.stage.update();
	    }
	  }]);
	
	  return Simulation;
	}();
	
	exports.default = Simulation;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global createjs */
	
	var Grid = function () {
	  function Grid(stage, boardSize, gridSize) {
	    _classCallCheck(this, Grid);
	
	    this.stage = stage;
	    this.squares = {};
	    this.states = {};
	    this.boardSize = boardSize;
	    this.gridSize = gridSize;
	
	    this.handleClick = this.handleClick.bind(this);
	    this.clearBoard = this.clearBoard.bind(this);
	  }
	
	  _createClass(Grid, [{
	    key: 'generateGrid',
	    value: function generateGrid() {
	      var square = void 0;
	
	      var numSq = this.boardSize / this.gridSize;
	
	      for (var r = 0; r < numSq; r++) {
	        for (var c = 0; c < numSq; c++) {
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
	
	          var id = square.x + "_" + square.y;
	          this.squares[id] = square;
	
	          this.states[id] = {
	            state: 'off',
	            pos: id
	          };
	        }
	      }
	      this.stage.update();
	    }
	  }, {
	    key: 'handleClick',
	    value: function handleClick(e) {
	      this.changeGridColor(e);
	      this.stage.update();
	    }
	  }, {
	    key: 'changeGridColor',
	    value: function changeGridColor(e) {
	      var id = e.target.x + "_" + e.target.y;
	      var currentSq = this.squares[id];
	      var currentState = this.states[id];
	      var color = void 0;
	
	      if (currentState.state === 'off') {
	        color = '#fff';
	        currentState.state = 'on';
	      } else {
	        color = '#000';
	        currentState.state = 'off';
	      }
	
	      currentSq.graphics.beginFill(color).drawRect(0, 0, this.gridSize, this.gridSize);
	    }
	  }, {
	    key: 'clearBoard',
	    value: function clearBoard() {
	      this.stage.clear();
	      this.generateGrid();
	    }
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map