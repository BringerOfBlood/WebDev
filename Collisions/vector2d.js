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
      return this.x * other.x + this.y * other.y;
    }
  
    scale(value) {
      let n = new Vec(this.x * value, this.y * value);
      return n;
    }
  
    rot90() {
      let n = new Vec(this.y, -this.x);
      return n;
    }
  
    norm() {
      return sqrt(this.x * this.x + this.y * this.y);
    }
  
    normalize() {
      let vec_length = this.norm();
      let n = new Vec(this.x / vec_length, this.y / vec_length);
      return n;
    }
  }