let movAvgShader;
let bffrShader;
let cam;

let buffer;
let img;
let frame_rate = 0.0;

function preload() {
  movAvgShader = loadShader("movAvg.vert", "movAvg.frag");
  bffrShader = loadShader("bffr.vert", "bffr.frag");
  changeShader = loadShader("change.vert", "change.frag");
}

function setup() {
  let scale_fak = 4;
  createCanvas(800, 600, WEBGL);

  buffer = createGraphics(width / scale_fak, height / scale_fak, WEBGL);
  avgImg = createGraphics(width / scale_fak, height / scale_fak, WEBGL);
  img = createGraphics(width / scale_fak, height / scale_fak, WEBGL);
  noStroke();

  // create video capture from webcam
  cam = createCapture(VIDEO);
  // set webcam size
  cam.size(width / scale_fak, height / scale_fak);
  // hide dom element (cam is displayed)
  cam.hide();
}

function draw() {
  background(220);

  buffer.shader(bffrShader);
  if (frameCount < 10) {
    bffrShader.setUniform("tex0", cam);
  } else {
    bffrShader.setUniform("tex0", avgImg);
  }
  buffer.rect(0, 0, width, height);

  avgImg.shader(movAvgShader);
  movAvgShader.setUniform("u_img", cam);
  movAvgShader.setUniform("u_buffer", buffer);
  avgImg.rect(0, 0, width, height);

  img.shader(changeShader);
  changeShader.setUniform("u_img", cam);
  changeShader.setUniform("u_avg", avgImg);
  img.rect(0, 0, width, height);

  image(img, -width / 2, -height / 2, width, height);

  if (frameCount < 10) {
    frame_rate = 1000 / (deltaTime + 0.1);
  } else {
    frame_rate = 0.9 * frame_rate + 0.1 * (1000 / (deltaTime + 0.1));
  }
  if (frameCount % 100 == 0) {
    print("Frame Rate: " + floor(frame_rate) + " Hz.");
  }
}
