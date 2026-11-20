// 最終課題を制作しよう

function setup(){
  createCanvas(windowWidth, windowHeight);
   
}

function draw(){
  background(160, 192, 255);
  fill(255);
    ellipse(100,100,20)
    ellipse(200,100,20)
    ellipse(500, 500, 20)
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
