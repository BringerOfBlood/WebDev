let qtree;

function setup() {
  createCanvas(400, 400);

  let boundary = new Rectangle(200, 200, 200, 200);
  qtree = new QuadTree(boundary, 4);
  
  for (var i = 0; i < 300; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let m = new Point(x, y);
    qtree.insert(m);
  }

  // for (var i = 0; i < 500; i++) {
  //   let p = new Point(random(width),random(height));
  //   qt.insert(p);
  // }
  // qtree.show();
  
  
  
}

function draw() {
  /*if (mouseIsPressed) {
    for (var i = 0; i < 5; i++) {
      let m = new Point(mouseX + random(-5, 5), mouseY + random(-5, 5));
      console.log('.')
      qtree.insert(m);
    }
  }*/

  background(0);
  qtree.show();

  stroke(0, 255, 0);
  rectMode(CENTER);
  let range = new Rectangle(mouseX, mouseY, 30, 30);
  rect(range.x, range.y, range.w*2 , range.h*2 );
  
  let points = []; 
  qtree.query(range, points);
  for (let p of points) {
    point(p.x, p.y)
  }
}
