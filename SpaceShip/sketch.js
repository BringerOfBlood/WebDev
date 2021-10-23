var stars = [];
var num_stars = 500;
var cam;
var cloud_size = 4;

function setup() {
  createCanvas(400, 400);
  stars = math.add(
    math.multiply(cloud_size, math.random([num_stars, 3])),
    math.multiply(
      math.multiply(cloud_size, math.ones(num_stars, 1)),
      math.matrix([-0.5, 1, -0.5]).reshape([1, -1])
    )
  );
  cam = new Camera();
}

function draw() {
  background(0);
  noStroke();
  cam.show(stars);
  cam.translate(0.0, 0.01, 0.0);
  cam.rotate(0.0,-0.005,0.0);
}

function rotX(vec, angle) {
  var cosa = math.cos(angle);
  var sina = math.sin(angle);
  var nsina = math.multiply(-1,math.sin(angle));

  M = math.matrix([[1, 0, 0], [0,cosa,nsina], [0,sina,cosa]]);
  return math.multiply(M, vec);
}
function rotY(vec, angle) {
  var cosa = math.cos(angle);
  var sina = math.sin(angle);
  var nsina = math.multiply(-1,math.sin(angle));

  M = math.matrix([[cosa,0,sina],[0,1,0], [nsina,0,cosa]]);
  return math.multiply(M, vec);
}
function rotZ(vec, angle) {
  var cosa = math.cos(angle);
  var sina = math.sin(angle);
  var nsina = math.multiply(-1,math.sin(angle));

  M = math.matrix([[cosa,nsina,0], [sina,cosa,0], [0,0,1]]);
  return math.multiply(M, vec);
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
    this.u = math.reshape(math.subtract(this.s0, this.s1), [3, 1]);
    this.v = math.reshape(math.subtract(this.s0, this.s2), [3, 1]);
  }
  rotate(dx, dy, dz) {
    var ds0 = math.subtract(this.s0,this.pos);
    var ds1 = math.subtract(this.s1,this.pos);
    var ds2 = math.subtract(this.s2,this.pos);
    ds0 = rotX(ds0,dx);
    ds0 = rotY(ds0,dy);
    ds0 = rotZ(ds0,dz);

    ds1 = rotX(ds1,dx);
    ds1 = rotY(ds1,dy);
    ds1 = rotZ(ds1,dz);

    ds2 = rotX(ds2,dx);
    ds2 = rotY(ds2,dy);
    ds2 = rotZ(ds2,dz);

    this.s0 = math.add(this.pos,ds0)._data;
    this.s1 = math.add(this.pos,ds1)._data;
    this.s2 = math.add(this.pos,ds2)._data;
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

    this.u = math.reshape(math.subtract(this.s0, this.s1), [3, 1]);
    this.v = math.reshape(math.subtract(this.s0, this.s2), [3, 1]);
  }
  show(stars) {
    for (var i = 0; i < stars.size()[0]; i++) {
      var star = stars._data[i];
      var w = math.reshape(math.subtract(star, this.pos), [3, 1]);
      var M = math.concat(this.u, this.v, math.multiply(w, 1));
      var b = math.reshape(math.subtract(this.s0, this.pos), [3, 1]);
      var x = math.lusolve(M, b);
      x = math.transpose(x);
      if (x[0][2] > 0 && x[0][0]>0.0 && x[0][0]<1.0 && x[0][1]>0.0 && x[0][1]<1.0) {
        //fill(x[0][2]*50)
        circle(x[0][0] * width, x[0][1] * height, 10 * x[0][2]);
      }
    }
  }
}
