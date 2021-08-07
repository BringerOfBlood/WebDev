// Background color
let bg_color = [20, 20, 50];
// instantiate variable for the quadtree
let qtree;

function setup() {
  console.log("START SETUP");
  let start_time = millis();
  // creates p5.js canvas
  createCanvas(400, 400);

  // instantiate boundary (necessary for the initial QuadTree node)
  bnd = new Boundary(width/2, height/2, width/2, height/2);
  // initial QuadTree node
  qtree = new QuadTree(bnd, 20);

  background(...bg_color);
  let pts = []
  for (var i = 0; i < 5000; i++) {
    let v = new Vec(random(width), random(height));
    pts.push(v)
    qtree.insert(v);
  }

  console.log(millis() - start_time + " milliseconds");
  console.log("END SETUP");
}

function draw() {
  background(...bg_color);
  //qtree.show();

  let qbnd = new Boundary(mouseX, mouseY, 30, 30);
  qbnd.show();

  querried_points = qtree.query(qbnd);

  for (let p of querried_points){
    point(p.x,p.y);
  }
}