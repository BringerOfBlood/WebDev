let particles = [];

function setup() {
  createCanvas(400, 400);
  background(0);
  
  for (var i = 0; i < 300; i++) {
    let p = new Particle();
    particles.push(p);
  }
}


function draw() {
  background(0)
  scan_collisions(particles)
  for (let p of particles) {
    p.update();
    p.show();
  }
}

function scan_collisions(particles) {
  for (var i = 0; i < particles.length; i++) {
    for (var j = i+1; j < particles.length; j++) {
      let a = particles[i];
      let b = particles[j];
      let d = a.loc.dist(b.loc);
      if (d<5) {
        particles[i].vel.x = random(-1,1);
        particles[i].vel.y= random(-1,1);
        particles[j].vel.x = random(-1,1);
        particles[j].vel.y = random(-1,1);
        
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
    return n
  }
  
  dist(other) {
    return Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
  }
}

class Particle {
  constructor() {
    this.loc = new Vec(random(width),random(height));
    this.vel = new Vec(random(-1,1),random(-1,1));
    
  }
  
  update() {
    this.loc = this.loc.add(this.vel);
    if (this.loc.x<0 || this.loc.x>width) {
      this.vel.x = -this.vel.x;
    }
    if (this.loc.y < 0 || this.loc.y > height) {
      this.vel.y = -this.vel.y;
    }
  }
  
  show() {
    stroke(0,255,0);
    strokeWeight(2);
    point(this.loc.x,this.loc.y);
  }
}