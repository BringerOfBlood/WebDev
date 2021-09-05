let w;
let h;

let clicked;

let board = [
  ["6", "7", "1", "", "", "", "2", "4", "9"],
  ["8", "", "", "7", "", "2", "", "", "1"],
  ["2", "", "", "", "6", "", "", "", "3"],
  ["", "5", "", "6", "", "3", "", "2", ""],
  ["", "", "8", "", "", "", "7", "", ""],
  ["", "1", "", "8", "", "4", "", "6", ""],
  ["9", "", "", "", "1", "", "", "", ""],
  ["1", "", "", "5", "", "", "", "", ""],
  ["5", "8", "7", "", "", "", "", "", ""],
];

let original = [
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

function setup() {
  createCanvas(400, 400);
  w = width / 9;
  h = height / 9;
  clicked = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] != "") {
        original[i][j] = "o";
      } else {
        original[i][j] = "e";
      }
    }
  }
}

function draw() {
  background(255);
  drawGrid();
  writeDigits();
}

function possible(x, y, n) {
  for (let i = 0; i < 9; i++) {
    let spot = board[i][x];
    if (spot == n) {
      return false;
    }
    spot = board[y][i];
    if (spot == n) {
      return false;
    }
  }
  x0 = floor(x / 3) * 3;
  y0 = floor(y / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let spot = board[y0 + j][x0 + i];
      if (spot == n) {
        return false;
      }
    }
  }
  return true;
}

function solve() {
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      let spot = board[y][x];
      if (spot == "") {
        for (let n = 1; n < 10; n++) {
          if (possible(x, y, n)) {
            board[y][x] = "" + n;
            solve();
            board[y][x] = "";
          }
        }
        return;
      }
    }
  }

  background(255);
  drawGrid();
  writeDigits();
  //noLoop();

  alert("next?");
}

function mousePressed() {
    solve();
}

function drawGrid() {
  for (let i = 1; i <= 9; i++) {
    strokeWeight(1);
    line(0, i * h, width, i * h);
    line(i * w, 0, i * w, height);
  }
  for (let i = 0; i < 4; i++) {
    strokeWeight(4);
    line(0, i * h * 3, width, i * h * 3);
    line(i * w * 3, 0, i * w * 3, height);
  }
}

function writeDigits() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let spot = board[j][i];
      if (original[j][i] == "o") {
        fill(0, 102, 153);
      } else {
        fill(0);
      }
      textSize(32);
      textAlign(CENTER, CENTER);
      text(spot, i * w + w / 2, j * h + h / 2);
    }
  }
}
