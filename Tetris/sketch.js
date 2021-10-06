var rows = 20;
var columns = 10;
var squareSize = 20;
var tetris;
var player;
var regularStepTime = 500;
var fastStepTime = 50;

var fr = 60;
var regularPeriod = 0.0;
var fastPeriod = 0.0;
var dump;

var tetremonio_names = ["I", "O", "J", "L", "S", "Z", "T"];
var tetremonio_I = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
];

var tetremonio_O = [
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

var tetremonio_J = [
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

var tetremonio_L = [
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
];

var tetremonio_S = [
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

var tetremonio_T = [
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
];

var tetremonio_Z = [
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
];

function setup() {
  createCanvas(columns * squareSize, rows * squareSize);
  player = new Player();
  dump = new TetrisDump();
}

function draw() {
  background(0);
  frameRate(fr);

  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      player.move("left");
    }
    if (keyCode === RIGHT_ARROW) {
      player.move("right");
    }
    if (keyCode === DOWN_ARROW) {
      player.move("down");
    }
  }
  player.update();
  player.draw();
  dump.update();
  dump.draw();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.move("up");
  }
}

class Shape {
  constructor() {
    this.blocks = [];
  }
  draw() {
    for (var block of this.blocks) {
      block.draw();
    }
  }
  collide(otherBlocks) {
    var flag = false;
    for (var ownBlock of this.blocks) {
      for (var otherBlock of otherBlocks) {
        if (ownBlock.i === otherBlock.i && ownBlock.j == otherBlock.j) {
          flag = true;
        }
      }
    }
    return flag;
  }
}

class TetrisDump extends Shape {
  constructor() {
    super();
    this.map = [];
    for (var i = 0; i < rows; i++) {
      this.map.push([]);
      for (var j = 0; j < columns; j++) {
        this.map[i].push(0);
      }
    }
  }
  appendBlocks(newBlocks) {
    for (var block of newBlocks) {
      this.blocks.push(block);
    }
  }

  update() {
    this.updateMap();
    var completeCols = this.getCompleteCols();
    this.removeCompleteCols(completeCols);
  }

  removeCompleteCols(completeCols) {
    for (var j of completeCols) {
      for (var idx = this.blocks.length - 1; idx >= 0; idx--) {
        var block = this.blocks[idx];
        if (block.j == j) {
          var index = this.blocks.indexOf(block);
          this.blocks.splice(index, 1);
        }
      }
      for (var block of this.blocks) {
        if (block.j < j) {
          block.j += 1;
        }
      }
    }
  }

  resetMap() {
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < columns; i++) {
        this.map[j][i] = 0;
      }
    }
  }

  updateMap() {
    this.resetMap();
    for (var block of this.blocks) {
      this.map[block.j][block.i] = 1;
    }
  }

  getCompleteCols() {
    // Initialize counter array (one element per row)
    var blockCounter = [];
    for (var rowIdx = 0; rowIdx < rows; rowIdx++) blockCounter.push(0);

    var completeCols = [];
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < columns; i++) {
        blockCounter[j] += this.map[j][i];
      }
      if (blockCounter[j] == columns) {
        completeCols.push(j);
      }
    }
    return completeCols;
  }
}

class Player extends Shape {
  constructor() {
    super();
    this.initNewTetremonio();
  }

  initNewTetremonio() {
    this.shapeName = random(tetremonio_names);
    this.setTetremonio();
    this.rotationIdx = 0;
    this.col = floor(columns / 2);
    this.row = 0;
    this.blocks = this.genShape(this.col, this.row, this.rotationIdx);
    this.move_horizontal = 0;
    this.move_down = 0;
    this.rotate = 0;
  }

  setTetremonio() {
    if (this.shapeName === "I") {
      this.color = [255, 0, 0];
      this.tetremonio = tetremonio_I;
    }
    if (this.shapeName === "O") {
      this.color = [255, 255, 0];
      this.tetremonio = tetremonio_O;
    }
    if (this.shapeName === "J") {
      this.color = [0, 0, 255];
      this.tetremonio = tetremonio_J;
    }
    if (this.shapeName === "L") {
      this.color = [125, 125, 0];
      this.tetremonio = tetremonio_L;
    }
    if (this.shapeName === "S") {
      this.color = [255, 0, 255];
      this.tetremonio = tetremonio_S;
    }
    if (this.shapeName === "T") {
      this.color = [0, 255, 255];
      this.tetremonio = tetremonio_T;
    }
    if (this.shapeName === "Z") {
      this.color = [0, 255, 0];
      this.tetremonio = tetremonio_Z;
    }
  }

  move(type) {
    if (type === "left") {
      this.move_horizontal = -1;
    }
    if (type === "right") {
      this.move_horizontal = +1;
    }
    if (type === "down") {
      this.move_down = +1;
    }
    if (type === "up") {
      this.rotate = +1;
    }
  }

  update() {
    regularPeriod += deltaTime;
    fastPeriod += deltaTime;
    if (fastPeriod > fastStepTime) {
      if (regularPeriod > regularStepTime) {
        regularPeriod = 0;
        this.move_down = +1;
      }
      fastPeriod = 0;
      // left and right
      var new_blocks = this.genShape(
        this.col + this.move_horizontal,
        this.row,
        this.rotationIdx
      );

      if (this.check_boundary(new_blocks) && !dump.collide(new_blocks)) {
        this.col += this.move_horizontal;
        this.blocks = new_blocks;
      } else {
        new_blocks = this.blocks;
      }

      // rotate
      var new_blocks = this.genShape(
        this.col,
        this.row,
        (this.rotationIdx + this.rotate) % this.tetremonio.length
      );

      if (this.check_boundary(new_blocks) && !dump.collide(new_blocks)) {
        this.rotationIdx =
          (this.rotationIdx + this.rotate) % this.tetremonio.length;
        this.blocks = new_blocks;
      } else {
        new_blocks = this.blocks;
      }

      // down
      new_blocks = this.genShape(
        this.col,
        this.row + this.move_down,
        this.rotationIdx
      );

      if (this.check_bottom(new_blocks) && !dump.collide(new_blocks)) {
        this.blocks = new_blocks;
        this.row += this.move_down;
      } else {
        dump.appendBlocks(this.blocks);
        this.initNewTetremonio();
      }

      this.move_horizontal = 0;
      this.move_down = 0;
      this.rotate = 0;
    }
  }

  check_boundary(new_blocks) {
    var flag = true;

    for (var block of new_blocks) {
      if (block.i < 0 || block.i >= columns) {
        flag = false;
      }
    }
    return flag;
  }

  check_bottom(new_blocks) {
    var flag = true;

    for (var block of new_blocks) {
      if (block.j >= rows) {
        flag = false;
      }
    }
    return flag;
  }

  genShape(col, row, rotationIdx) {
    var blocks = [];
    for (var j = 0; j < this.tetremonio[0].length; j++) {
      for (var k = 0; k < this.tetremonio[0][0].length; k++) {
        if (this.tetremonio[rotationIdx][j][k] > 0.5) {
          var block_j = j - floor(this.tetremonio[0].length / 2) + col;
          var block_k = k - floor(this.tetremonio[0][0].length / 2) + row;
          blocks.push(new Block(block_j, block_k, this.color));
        }
      }
    }
    return blocks;
  }
}

class Block {
  constructor(i, j, color) {
    this.i = i;
    this.j = j;
    this.color = color;
  }
  draw() {
    fill(...this.color);
    rect(this.i * squareSize, this.j * squareSize, squareSize, squareSize);
  }
}
