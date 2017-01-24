const Cell = require('./javascripts/cell');

document.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.getElementById('canvas');

  const ctx = canvasElement.getContext('2d');

  alert(ctx);

});
