var stars = [];
var num_stars = 500;
var ship;
var cloud_size = 10;
var star_size = 20;

function setup() {
  createCanvas(1500, 700);
  stars = math.add(
    math.multiply(cloud_size, math.random([num_stars, 3])),
    math.multiply(
      math.multiply(cloud_size, math.ones(num_stars, 1)),
      math.matrix([-0.5, 1, -0.5]).reshape([1, -1])
    )
  );
  ship = new SpaceShip();
}

function draw() {
  background(0);
  noStroke();
  //cam.show(stars);
  //cam.translate(0.0, 0.01, 0.0);
  //cam.rotate(0.0, -0.005, 0.0);
  ship.update();
  ship.show();
}

class SpaceShip {
  constructor() {
    this.acceleration = 0.001;
    this.momentum = 0.99;
    this.angleAcceleration = 0.003;
    this.angleMomentum = 0.9;

    this.pos = [0.0, 0.0, 0.0];
    this.vel = [0.0, 0.0, 0.0];

    this.front = [0, .8, 0];
    this.right = [width/height, 0, 0];
    this.down = [0, 0, 1];

    this.pitch_speed = 0;
    this.roll_speed = 0;
    this.speed = 0;
    this.cam = new Camera();
  }

  update() {
    if (keyIsDown(UP_ARROW)) {
      this.pitch_speed += this.angleAcceleration;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.pitch_speed -= this.angleAcceleration;
    }
    this.pitch_speed *= this.angleMomentum;
    this.front = rotAx(this.front, this.right, this.pitch_speed);
    this.down = rotAx(this.down, this.right, this.pitch_speed);
    this.right = rotAx(this.right, this.right, this.pitch_speed);

    if (keyIsDown(LEFT_ARROW)) {
      this.roll_speed += this.angleAcceleration;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.roll_speed -= this.angleAcceleration;
    }
    this.roll_speed *= this.angleMomentum;
    this.front = rotAx(this.front, this.front, this.roll_speed);
    this.down = rotAx(this.down, this.front, this.roll_speed);
    this.right = rotAx(this.right, this.front, this.roll_speed);

    if (keyIsDown(32)) {
      this.speed += this.acceleration;
      //this.vel = math.add(math.multiply(this.acceleration, this.front), this.vel);
    }
    this.speed *= this.momentum;
    this.vel = math.multiply(this.front,this.speed);
    //this.vel = math.multiply(this.momentum, this.vel);
    this.pos = math.add(this.pos, this.vel);

    this.cam.s0 = math.add(
      this.pos,
      math.subtract(
        math.subtract(this.front, math.multiply(0.5, this.right)),
        math.multiply(0.5, this.down)
      )
    );

    this.cam.s1 = math.add(this.cam.s0, this.right);
    this.cam.s2 = math.add(this.cam.s0, this.down);
    this.cam.pos = this.pos;

    //console.log(math.dot(this.right,this.down));
    //console.log(math.norm(math.subtract(this.cam.s0,this.cam.s1)))

    //console.log(math.subtract(this.cam.s0,this.pos));
    //this.cam.translate(this.vel[0],this.vel[1],this.vel[2]);
  }

  show() {
    this.cam.show(stars);
  }
}

class Camera {
  constructor(
    pos = [0, 0, 0],
    s0 = [-0.5, 1, -0.5],
    s1 = [0.5, 1, -0.5],
    s2 = [-0.5, 1, 0.5]
  ) {
    this.pos = pos;
    this.s0 = s0;
    this.s1 = s1;
    this.s2 = s2;
  }
  rotate(dx, dy, dz) {
    var ds0 = math.subtract(this.s0, this.pos);
    var ds1 = math.subtract(this.s1, this.pos);
    var ds2 = math.subtract(this.s2, this.pos);
    ds0 = rotX(ds0, dx);
    ds0 = rotY(ds0, dy);
    ds0 = rotZ(ds0, dz);

    ds1 = rotX(ds1, dx);
    ds1 = rotY(ds1, dy);
    ds1 = rotZ(ds1, dz);

    ds2 = rotX(ds2, dx);
    ds2 = rotY(ds2, dy);
    ds2 = rotZ(ds2, dz);

    this.s0 = math.add(this.pos, ds0)._data;
    this.s1 = math.add(this.pos, ds1)._data;
    this.s2 = math.add(this.pos, ds2)._data;
  }
  translate(dx, dy, dz) {
    this.s0[0] += dx;
    this.s0[1] += dy;
    this.s0[2] += dz;

    this.s1[0] += dx;
    this.s1[1] += dy;
    this.s1[2] += dz;

    this.s2[0] += dx;
    this.s2[1] += dy;
    this.s2[2] += dz;

    this.pos[0] += dx;
    this.pos[1] += dy;
    this.pos[2] += dz;
  }
  show(stars) {
    this.u = math.reshape(math.subtract(this.s0, this.s1), [3, 1]);
    this.v = math.reshape(math.subtract(this.s0, this.s2), [3, 1]);
    //console.log(this.u);
    noStroke();
    for (var i = 0; i < stars.size()[0]; i++) {
      var star = stars._data[i];
      var w = math.reshape(math.subtract(star, this.pos), [3, 1]);
      var M = math.concat(this.u, this.v, math.multiply(w, 1));
      var b = math.reshape(math.subtract(this.s0, this.pos), [3, 1]);
      var x = math.lusolve(M, b);
      x = math.transpose(x);
      if (
        x[0][2] > 0 &&
        x[0][0] > 0.0 &&
        x[0][0] < 1.0 &&
        x[0][1] > 0.0 &&
        x[0][1] < 1.0
      ) {
        //fill(x[0][2]*50)
        circle(x[0][0] * width, x[0][1] * height, star_size * x[0][2]);
      }
    }
    stroke(0,220,0);
    line(0.5*width-20,0.5*height,0.5*width+20,0.5*height);
    line(0.5*width,0.5*height-20,0.5*width,0.5*height+20);
  }
}

function rotX(vec, angle) {
  var cosa = math.cos(angle);
  var sina = math.sin(angle);
  var nsina = math.multiply(-1, math.sin(angle));

  M = math.matrix([
    [1, 0, 0],
    [0, cosa, nsina],
    [0, sina, cosa],
  ]);
  return math.multiply(M, vec);
}
function rotY(vec, angle) {
  var cosa = math.cos(angle);
  var sina = math.sin(angle);
  var nsina = math.multiply(-1, math.sin(angle));

  M = math.matrix([
    [cosa, 0, sina],
    [0, 1, 0],
    [nsina, 0, cosa],
  ]);
  return math.multiply(M, vec);
}
function rotZ(vec, angle) {
  var cosa = math.cos(angle);
  var sina = math.sin(angle);
  var nsina = math.multiply(-1, math.sin(angle));

  M = math.matrix([
    [cosa, nsina, 0],
    [sina, cosa, 0],
    [0, 0, 1],
  ]);
  return math.multiply(M, vec);
}

function rotAx(vec, n, angle) {
  var n = math.multiply(1 / math.norm(n), n);
  var cosa = math.cos(angle);
  var ecosa = 1 - cosa;
  var sina = math.sin(angle);

  n1 = n[0];
  n2 = n[1];
  n3 = n[2];
  //console.log(n1,n2,n3,cosa,ecosa,sina);
  M = math.matrix([
    [
      n1 * n1 * ecosa + cosa,
      n1 * n2 * ecosa - n3 * sina,
      n1 * n3 * ecosa + n2 * sina,
    ],
    [
      n2 * n1 * ecosa + n3 * sina,
      n2 * n2 * ecosa + cosa,
      n2 * n3 * ecosa - n1 * sina,
    ],
    [
      n3 * n1 * ecosa - n2 * sina,
      n3 * n2 * ecosa + n1 * sina,
      n3 * n3 * ecosa + cosa,
    ],
  ]);
  //console.log(M)
  return math.multiply(M, vec)._data;
}
