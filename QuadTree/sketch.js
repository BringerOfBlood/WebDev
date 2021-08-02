let qtree;

function setup() {
  createCanvas(400, 400);= new QuadTree(boundary, 4);

  let boundary = new Rectangle(200, 200, 200, 200);
  qtree = new QuadTree(boundary, 4);

  // for (var i = 0; i < 500; i++) {
  //   let p = new Point(random(width),random(height));
  //   qt.insert(p);
  // }

  console.log(qtree);
}

function draw() {
  if (mouseIsPressed) {
    for (var i = 0; i < 5; i++) {
      let m = new Point(mouseX + random(-5, 5), mouseY + random(-5, 5));
      qtree.insert(m);
    }
    console.log('test')
  }

  background(0);
  qtree.show();
}
