let humanPlayer;
let aiPlayer;
let ball;

function setup() {
  createCanvas(600, 400);
  humanPlayer = new Player("human");
  aiPlayer = new Player("ai");
  ball = new Ball();
}

function draw() {
  background(0);
  // update states of game objects
  humanPlayer.update();
  aiPlayer.update();
  ball.update();
  // draw current state
  humanPlayer.show();
  aiPlayer.show();
  ball.show();
}

class Ball {
  constructor(speed = 5, size = 20) {
    this.size = size;
    this.x = width / 2;
    this.y = 0.1 * height + 0.8 * random(height);
    let nx = round(random()) * 2 - 1;
    let ny = random() * 2 - 1;
    let nlength = Math.sqrt(nx * nx + ny * ny);
    this.vx = (speed * nx) / nlength;
    this.vy = (speed * ny) / nlength;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      //this.vx = -this.vx;
      ball = new Ball();
    }
    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.vy = -this.vy;
    }

    if (humanPlayer.collide(this) || aiPlayer.collide(this)) {
      this.vx = -this.vx;
    }
  }
  show() {
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Player {
  constructor(playerType, w = 20, h = 70, speed = 3) {
    this.playerType = playerType;
    this.w = w;
    this.h = h;
    this.speed = speed;
    if (this.playerType == "human") {
      this.x = width - this.w / 2 - 5;
    } else {
      this.x = this.w / 2 + 5;
    }
    this.y = height / 2;
    this.vy = 0;
  }

  collide(ball) {
    if (
      ball.x < this.x + this.w / 2 + ball.size / 2 &&
      ball.x > this.x - this.w / 2 - ball.size / 2 &&
      ball.y < this.y + this.h / 2 + ball.size / 2 &&
      ball.y > this.y - this.h / 2 - ball.size / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    if (this.playerType == "ai") {
      if (ball.y > this.y) {
        this.vy = this.speed;
      } else {
        this.vy = -this.speed;
      }
    } else if (this.playerType == "human") {
      if (keyIsPressed) {
        if (keyCode == UP_ARROW) {
          this.vy = -this.speed;
        } else if (keyCode == DOWN_ARROW) {
          this.vy = this.speed;
        }
      } else {
        this.vy = 0;
      }
    }
    this.y += this.vy;
    if (this.y < this.h / 2) {
      this.y = this.h / 2;
    } else if (this.y > height - this.h / 2) {
      this.y = height - this.h / 2;
    }
  }

  show() {
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}
