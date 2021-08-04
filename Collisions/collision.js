let particles = [];

function setup() {
  createCanvas(400, 400);
  background(0);

  for (var i = 0; i < 50; i++) {
    let p = new Particle(50);
    particles.push(p);
  }
  /*let p1 = new Particle(10);
  p1.loc.x = 100
  p1.loc.y = 200
  p1.vel.x = 1
  p1.vel.y = 0
  particles.push(p1)

  let p2 = new Particle(10);
  p2.loc.x = 300
  p2.loc.y = 196
  p2.vel.x = -1
  p2.vel.y = 0
  particles.push(p2)*/
}

function draw() {
  background(0);
  scan_collisions(particles);
  for (let p of particles) {
    p.update();
    p.show();
  }
}

function scan_collisions(particles) {
  for (var i = 0; i < particles.length; i++) {
    for (var j = i + 1; j < particles.length; j++) {
      let a = particles[i];
      let b = particles[j];
      let d = a.loc.dist(b.loc);
      if (d < (particles[i].size/2) && !particles[i].collided && !particles[j].collided) {
        let connect_vec = particles[i].loc.diff(particles[j].loc);


        let ax1 = connect_vec.normalize();
        let ax2 = ax1.rot90().normalize();

        particles[i].loc = particles[j].loc.add(ax1.scale(particles[i].size/2))
        
        // velocity particle i
        particles[i].vel = ax1.scale(ax1.dot(particles[j].vel)).add(ax2.scale(ax2.dot(particles[i].vel)))
        // velocity particle j
        particles[j].vel = ax1.scale(-ax1.dot(particles[i].vel)).add(ax2.scale(ax2.dot(particles[j].vel)))
        /*particles[i].vel.x = random(-1, 1);
        particles[i].vel.y = random(-1, 1);
        particles[j].vel.x = random(-1, 1);
        particles[j].vel.y = random(-1, 1);*/
        particles[i].collided = true;
        particles[j].collided = true;
      } 
      if (d > (particles[i].size/2)) {
        particles[i].collided = false;
        particles[j].collided = false;
      }
    }
  }
}

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    let n = new Vec(this.x + other.x, this.y + other.y);
    return n;
  }

  dist(other) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
    );
  }

  diff(other) {
    let n = new Vec(this.x - other.x, this.y - other.y);
    return n;
  }

  dot(other) {
    return this.x*other.x + this.y*other.y;
  }

  scale(value) {
    let n = new Vec(this.x*value, this.y*value);
    return n;
  }

  rot90() {
    let n = new Vec(this.y, -this.x);
    return n;
  }

  norm() {
    return sqrt(this.x*this.x+this.y*this.y);
  }

  normalize() {
    let vec_length = this.norm();
    let n = new Vec(this.x/vec_length,this.y/vec_length)
    return n;
  }
}

class Particle {
  constructor(size) {
    this.size = size;
    this.collided = false;
    this.loc = new Vec(random(width), random(height));
    let angle = random(TWO_PI);
    this.vel = new Vec(sin(angle), cos(angle));
  }

  update() {
    this.loc = this.loc.add(this.vel);
    if (this.loc.x < 0 || this.loc.x > width) {
      this.vel.x = -this.vel.x;
    }
    if (this.loc.y < 0 || this.loc.y > height) {
      this.vel.y = -this.vel.y;
    }
  }

  show() {
    stroke(0, 50, 150);
    fill(0, 50, 150);
    circle(this.loc.x, this.loc.y, this.size/2);
  }
}
