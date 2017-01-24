const Grid = function(ctx, height, width) {
  this.width = width;
  this.height = height;
  this.ctx = ctx;
  this.squares = [];
};

Grid.prototype.drawGrid = function(size) {
  let numGridCol = this.width / size;
  let numGridRow = this.height / size;

  for(let c = 0; c < numGridCol; c++) {
    for(let r = 0; r < numGridRow; r++) {
    }
  }
};
