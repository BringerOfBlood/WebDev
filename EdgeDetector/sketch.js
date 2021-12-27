let edgeDetector;
let blurrShader;
let cam;

function preload() {
  edgeDetector = loadShader("edgeDetector.vert", "edgeDetector.frag");
  blurrShader = loadShader("blurrShader.vert", "blurrShader.frag");
}

function setup() {
  createCanvas(200, 150, WEBGL);

  blurr_buffer = createGraphics(width, height, WEBGL);
  noStroke();

  // create video capture from webcam
  cam = createCapture(VIDEO);
  // set webcam size
  cam.size(width, height);
  // hide dom element (cam is displayed)
  cam.hide();
}

function draw() {
  background(220);

  blurr_buffer.shader(blurrShader);
  blurrShader.setUniform('tex0',cam);
  blurrShader.setUniform('dx',1/width);
  blurrShader.setUniform('dy',1/height);
  blurr_buffer.rect(0, 0, width, height);

  // activates the shader
  shader(edgeDetector);
  // pass camera as texture to the shader
  edgeDetector.setUniform('tex0',blurr_buffer);
  // pass normalized vertical increment to the shader
  edgeDetector.setUniform('dx',1/width);
  // pass normalized horizontal increment to the shader
  edgeDetector.setUniform('dy',1/height);
  // create rectangle, where shader is applied
  rect(0, 0, width, height);
  //image(blurr_buffer,-width/2,-height/2,width,height);
}
