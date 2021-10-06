var angle = 0;

var slider;
var seed;

function setup() {
  createCanvas(400, 400);
  slider = createSlider(0, PI/2, PI / 4, 0.01);
  seed = floor(random(10000));
}

function draw() {
  background(51);
  angle = slider.value();

  randomSeed(seed);
  stroke(255);
  translate(200, height);
  branch(100);
  
}

function branch(len,weight=5) {
  line(0, 0, 0, -len);
  translate(0, -len);
  strokeWeight(weight);
  if (len > 4) {
    push();
    rotate(angle*random(0.2,1.3));
    branch(len * random(0.6,0.75),weight*0.8);
    pop();

    push();
    rotate(-angle*random(0.2,1.3));
    branch(len * random(0.6,0.75),weight*0.8);
    pop();
  }
}
