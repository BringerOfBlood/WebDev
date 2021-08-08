let particles = [];
let num_particles = 500;
let grid_delta = 40;
let grid = [];
let u_mean = [];
let v_mean = [];
let density = [];
let speed_scale = 30;
let momentum = 0.99;
let particle_size = 2


function setup() {
  createCanvas(400, 400);
  background(0);

  for (var i = 0; i < num_particles; i++) {
    let p = new Particle(particle_size, i);
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
  for (var i = 0; i < width/grid_delta ; i++){
    for (var j = 0; j < height/grid_delta ; j++) {
      let xg = i*grid_delta+grid_delta/2;
      let yg = j*grid_delta+grid_delta/2;
      grid.push(new Vec(xg,yg));
      u_mean.push(0);
      v_mean.push(0);
      density.push(0);
    }
  }
}

function draw() {
  background(0);
  scan_collisions(particles);
  for (let p of particles) {
    // p.show();
    p.update();
    //p.show();
  }
  for (var i = 0; i < 20; i++) {
    particles[i].show();
  }
  stroke(0)
  fill(0,120,0)
  rect(150,150,100,100);
}

function collide(a, b) {
  let d = a.loc.dist(b.loc);
  if (d < a.size / 2 && !a.collided && !b.collided) {
    let connect_vec = a.loc.diff(b.loc);

    let ax1 = connect_vec.normalize();
    let ax2 = ax1.rot90().normalize();

    a.loc = b.loc.add(ax1.scale(a.size / 2));

    // velocity particle i
    a.vel = ax1.scale(ax1.dot(b.vel)).add(ax2.scale(ax2.dot(a.vel)));
    // velocity particle j
    b.vel = ax1.scale(-ax1.dot(a.vel)).add(ax2.scale(ax2.dot(b.vel)));
    /*a.vel.x = random(-1, 1);
    a.vel.y = random(-1, 1);
    b.vel.x = random(-1, 1);
    b.vel.y = random(-1, 1);*/
    a.collided = true;
    b.collided = true;
    // stroke(250,0,0);
    // line(a.x,a.y,b.x,b.y)
  }
  if (d > a.size / 2) {
    a.collided = false;
    b.collided = false;
  }
}

function scan_collisions(particles) {
  let bnd = new Boundary(width/2,height/2,width/2,height/2);
  let qtree = new QuadTree(bnd,1);
  for (let p of particles) {
    qtree.insert(p)
  }
  // qtree.show()

  for (var i = 0; i < particles.length; i++) {
    let a = particles[i];
    let qbnd = new Boundary(a.x,a.y,a.size/2,a.size/2);
    pts = qtree.query(qbnd)
    for (let p of pts){
      //stroke(250,0,0);
      //line(p.x,p.y,a.x,a.y)
      //particles[p.id].loc.x = particles[p.id].loc.x-1

      if (p.id>i) {
       collide(a,p)
      }
      
      let b = particles[p.id];
      // b.loc.x = b.loc.x -1

      // collide(a,b)

      //collide(particles[p.id],particles[q.id])
    }
  } 

  // for (var i = 0; i < particles.length; i++) {
  //   for (var j = i + 1; j < particles.length; j++) {
  //     let a = particles[i];
  //     let b = particles[j];
  //     collide(a,b)
  //   }
  // }
  for (var i = 0; i < grid.length; i++){
    
    let gbnd = new Boundary(grid[i].x,grid[i].y,grid_delta/2,grid_delta/2);
    let u_mean_current = 0;
    let v_mean_current = 0;
    let pts = qtree.query(gbnd);
    for (let p of pts){
      u_mean_current +=  p.vel.x/pts.length
      v_mean_current +=  p.vel.y/pts.length
    }
    if (pts.length>0) {
    u_mean[i] = momentum*u_mean[i] + (1-momentum)*u_mean_current;
    v_mean[i] = momentum*v_mean[i] + (1-momentum)*v_mean_current;
    }
    density[i] = momentum*density[i] + (1-momentum)*pts.length;
    strokeWeight(density[i]/2);
    stroke(255)
    point(grid[i].x,grid[i].y);

    stroke(255,0,0)
    strokeWeight(2);
    line(grid[i].x,grid[i].y,grid[i].x+speed_scale*u_mean[i],grid[i].y+speed_scale*v_mean[i])
  }
}



class Particle {
  constructor(size, id) {
    this.id = id;
    this.size = size;
    this.collided = false;
    this.loc = new Vec(random(width), random(height));
    let angle = random(TWO_PI);
    // this.vel = new Vec(sin(angle), cos(angle));
    this.vel = new Vec(random(-1,1), random(-1,1));
  }

  get x() {
    return this.loc.x;
  }

  get y() {
    return this.loc.y;
  }
  xreflector(xmin,xmax,ymin,ymax) {
    if (this.loc.x > xmin && this.loc.x < xmax && this.loc.y > ymin && this.loc.y < ymax) {
      if (this.loc.x<(xmin+xmax)/2) {
        this.loc.x = xmin;
        this.vel.x = -this.vel.x;
        this.vel.y = -this.vel.y;
      } 
      else {
        this.loc.x = xmax;
        this.vel.x = -this.vel.x;
        this.vel.y = -this.vel.y;
      }
    }
  }
  yreflector(xmin,xmax,ymin,ymax) {
    if (this.loc.x > xmin && this.loc.x < xmax && this.loc.y > ymin && this.loc.y < ymax) {
      if (this.loc.y<(ymin+ymax)/2) {
        this.loc.y = ymin;
        this.vel.x = -this.vel.x;
        this.vel.y = -this.vel.y;
      } 
      else {
        this.loc.y = ymax;
        this.vel.x = -this.vel.x;
        this.vel.y = -this.vel.y;
      }
    }
  }
  update() {
    this.loc = this.loc.add(this.vel);
    // if (this.loc.x<10) {
    //   this.vel.x = this.vel.x + 0.1;
    //   this.vel.y = this.vel.y;
    // }
    // if (this.loc.x> width-10) {
    //   this.vel.x = this.vel.x - 0.1;
    //   this.vel.y = this.vel.y;
    // }

    // if (this.loc.x < 0 || this.loc.x > width) {
    //   this.loc.x = 0;
    //   this.vel.x = random(-1,1);
    //   this.vel.y = random(-1,1);
    // }

    // if (this.loc.x < 0 || this.loc.x > width) {
    //   this.vel.x = -this.vel.x;
    // }
    if (this.loc.x<40) {
      this.vel.x = this.vel.x - 0.1*(this.vel.x - 1);
      this.vel.y = this.vel.y - 0.1*(this.vel.y - 0);
    }
    if (this.loc.x<0) {
      this.loc.x += width;
    }
    if (this.loc.x>width) {
      this.loc.x -= width;
    }
    
    this.xreflector(150,160,150,250);
    this.xreflector(240,250,150,250);
    this.yreflector(150,250,150,160);
    this.yreflector(150,250,240,250);
    if (this.loc.x<240 && this.loc.x>160 && this.loc.y<240 && this.loc.y>160) {
      this.loc.x = random(width);
      this.loc.y = random(height);
    }
    // if (this.loc.x > 150 && this.loc.x < 250 && this.loc.y > 150 && this.loc.y < 250) {
    //   if (this.loc.x<200 &&this.loc.x<this.loc.y) {
    //     this.loc.x = 150;
    //     this.vel.x = -this.vel.x;
    //     this.vel.y = -this.vel.y;
    //   } 
    //   else {
    //     this.loc.x = 250;
    //     this.vel.x = -this.vel.x;
    //   }
    // }

    if (this.loc.y < 0 || this.loc.y > height) {
      this.vel.y = -this.vel.y;
    }
    if (this.loc.y < 0) {
      this.loc.y = 0
    }
    if (this.loc.y > height) {
      this.loc.y = height
    }
  }

  show() {
    stroke(0, 50, 150);
    fill(0, 50, 150);
    circle(this.loc.x, this.loc.y, this.size / 2);
  }
}
