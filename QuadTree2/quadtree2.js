let bg_color = [20, 20, 50];
let qtree;

function setup() {
  createCanvas(400, 400);

  bnd = new Boundary(200, 200, 200, 200);
  qtree = new QuadTree(bnd, 0);

  background(...bg_color);
  for (var i = 0; i < 50; i++) {
    stroke(250);
    strokeWeight(5);
    let v = new Vec(random(width), random(height));
    point(v.x, v.y);
    qtree.insert(v);
  }

}

function draw() {
  qtree.show();
}

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Boundary {
  /*
  rectangular boundary with center (x,y) and a height of 2*h and a width of 2*w
  */
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  isinside(p) {
    // returna true, if p (expected as Vec class object) is inside the boundary
    return (p.x < this.x + this.w &&
      p.x > this.x - this.w &&
      p.y < this.y + this.h &&
      p.y > this.y - this.h);
  }
}

class QuadTree {
  constructor(bnd, cap) {
    // Boundary class object
    this.bnd = bnd;
    // integer, defining the capacity of points in each node
    this.cap = cap;
    this.divided = false;
    // instantiate empty list of points connected to that node. is empty, if node is subdivided
    this.points = [];
  }

  insert(p) {
    // return, if point p is not inside of the boundary
    if (!this.bnd.isinside(p)) {
      return;
    }
    // check whether node is subdivided
    if (this.divided) {
      // if subdivided, try to insert point p ( lass Vec) into each branch
      this.ne.insert(p);
      this.nw.insert(p);
      this.sw.insert(p);
      this.sw.insert(p);
    } else {
      // append p to the list of points only if node is not already subdivided
      this.points.push(p);
      // check, if list of points is longer than the capacity 
      if (this.points.length > this.cap) {
        // redistribute points by subdividing the boundary in 4 quadrants
        this.subdivide(this.points);
        this.points = [];
        this.divided = true;
      }
    }
  }

  subdivide(points) {
    /*
    method to subdivide a QuadTree node into 4 subregions by splitting the boundary rectangle into 4 sub boundaries, one per quadrant.
    */
    let x = this.bnd.x;
    let y = this.bnd.y;
    let w = this.bnd.w;
    let h = this.bnd.h;
    
    this.nw = new QuadTree(new Boundary(x - w / 2, y - h / 2, w / 2, h / 2), this.cap);
    this.ne = new QuadTree(new Boundary(x + w / 2, y - h / 2, w / 2, h / 2), this.cap);
    this.se = new QuadTree(new Boundary(x - w / 2, y + h / 2, w / 2, h / 2), this.cap);
    this.sw = new QuadTree(new Boundary(x + w / 2, y + h / 2, w / 2, this.h / 2), this.cap);

    for (let pp of this.points) {
      this.ne.insert(pp);
      this.nw.insert(pp);
      this.sw.insert(pp);
      this.sw.insert(pp);
    }
  }

  show() {
    strokeWeight(1);
    if (!this.divided) {
      stroke(160, 0, 0);
    } else {
      stroke(0, 255, 0);
    }
    noFill();
    rect(this.bnd.x - this.bnd.w, this.bnd.y - this.bnd.h, this.bnd.w * 2, this.bnd.h * 2);
    if (this.divided) {
      this.ne.show();
      this.nw.show();
      this.se.show();
      this.sw.show();
    } 
  }
}