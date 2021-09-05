let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let w;
let h;

let human = "O";
let ai = "X";
let currentPlayer = human;

function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
  bestMove();
}

function equals3(a, b, c) {
  return a == b && b == c && a != "";
}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[1][1];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[1][1];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return "tie";
  } else {
    return winner;
  }
}

function mousePressed() {
  if (currentPlayer == human) {
    // Human make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == "") {
      board[i][j] = human;
      currentPlayer = ai;
      bestMove();
    }
  }
}

function draw() {
  background(255);
  strokeWeight(4);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = i * w + w / 2;
      let y = j * h + h / 2;
      let spot = board[i][j];
      textSize(32);
      if (spot == 'O') {
        noFill();
        ellipse(x, y, w / 2);
      } else if (spot == 'X') {
        let xr = w / 4;
        line(x - xr, y - xr, x + xr, y + xr);
        line(x + xr, y - xr, x - xr, y + xr);
      }
    }
  }

  let result = checkWinner();
  if (result != null) {
    noLoop();
    let resultP = createP("");
    resultP.style("font-size", "32pt");
    if (result == "tie") {
      resultP.html("Tie!");
    } else {
      resultP.html(`${result} wins!`);
    }
    //createP(result).style('color','#FFF').style('font-size','32pt');
  }
}
