class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  contains(point) {
    return (point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h);
  }
}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;
  }
  
  subdivide() {
    
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    
    let ne = new Rectangle(x + w/2, y - h/2, w/2, h/2);
    let nw = new Rectangle(x - w/2, y - h/2, w/2, h/2);
    let se = new Rectangle(x + w/2, y + h/2, w/2, h/2);
    let sw = new Rectangle(x - w/2, y + h/2, w/2, h/2);
    this.northwest = new QuadTree(nw, this.capacity);
    this.northeast = new QuadTree(ne, this.capacity);
    this.southwest = new QuadTree(sw, this. capacity);
    this.southeast = new QuadTree(se, this.capacity);
  }
  
  insert(point) {
    // check if this node contains the point
    if (!this.boundary.contains(point)) {
      return false;
    }
    // check if nodes capacity is reached
    if (this.points.length < this.capacity) {
      // insert node if capacity ia avail
      this.points.push(point);
      return true;
    } else {
      // check if node is divided
      if (!this.divided) {
        this.subdivide();
        this.divided = true;
      }
      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }
  
  show() {
    stroke(255);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
    if (this.divided){
      this.northwest.show();
      this.northeast.show();
      this.southwest.show();
      this.southeast.show();
    }
    for (let p of this.points) {
      strokeWeight(1);
      point(p.x, p.y);
    }
  }
}