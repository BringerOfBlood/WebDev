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
    return (
      p.x < this.x + this.w &&
      p.x > this.x - this.w &&
      p.y < this.y + this.h &&
      p.y > this.y - this.h
    );
  }

  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
    range.x + range.w < this.x - this.w ||
    range.y - range.h > this.y + this.h ||
    range.y + range.h < this.y - this.h);
  }

  show() {
    strokeWeight(1);
    stroke(0, 250, 0);
    noFill();
    rect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
  }
}

class QuadTree {
  constructor(bnd, cap) {
    // Boundary class object
    this.bnd = bnd;
    // integer, defining the capacity of points in each node
    this.cap = cap;
    // initialize as non-divided
    this.divided = false;
    // instantiate empty list of points connected to that node. is empty, if node is subdivided
    this.points = [];
  }

  query(qbnd) {
    let pts = [];
    if (this.bnd.intersects(qbnd)) {
      if (this.divided) {
        let nw_pts = this.nw.query(qbnd);
        let ne_pts = this.ne.query(qbnd);
        let sw_pts = this.sw.query(qbnd);
        let se_pts = this.se.query(qbnd);
        pts.push(...nw_pts);
        pts.push(...ne_pts);
        pts.push(...sw_pts);
        pts.push(...se_pts);
      } else {
        for (let p of this.points) {
          if (qbnd.isinside(p)) {
            pts.push(p);
          }
        }
      }
    }
    return pts;
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
      this.se.insert(p);
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
    method to subdivide a QuadTree node into 4 subregions by splitting the
    boundary rectangle into 4 sub boundaries, one per quadrant.
    */
    let x = this.bnd.x;
    let y = this.bnd.y;
    let w = this.bnd.w;
    let h = this.bnd.h;

    this.nw = new QuadTree(
      new Boundary(x - w / 2, y - h / 2, w / 2, h / 2),
      this.cap
    );
    this.ne = new QuadTree(
      new Boundary(x + w / 2, y - h / 2, w / 2, h / 2),
      this.cap
    );
    this.sw = new QuadTree(
      new Boundary(x - w / 2, y + h / 2, w / 2, h / 2),
      this.cap
    );
    this.se = new QuadTree(
      new Boundary(x + w / 2, y + h / 2, w / 2, h / 2),
      this.cap
    );

    for (let pp of points) {
      this.nw.insert(pp);
      this.ne.insert(pp);
      this.sw.insert(pp);
      this.se.insert(pp);
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
    rect(
      this.bnd.x - this.bnd.w,
      this.bnd.y - this.bnd.h,
      this.bnd.w * 2,
      this.bnd.h * 2
    );
    //stroke(255);
    //strokeWeight(10);
    //point(this.bnd.x,this.bnd.y);
    if (this.divided) {
      this.ne.show();
      this.nw.show();
      this.se.show();
      this.sw.show();
    } else {
      stroke(100, 100, 100);
      strokeWeight(5);
      for (let p of this.points) {
        point(p.x, p.y);
      }
    }
  }
}
