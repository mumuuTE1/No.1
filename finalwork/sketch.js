// 最終課題を制作しよう

function setup(){
  createCanvas(windowWidth, windowHeight);
   
}

function draw(){
  background(160, 192, 255);
  fill(177);
    ellipse(100,100,20)
    ellipse(200,100,20)
    fill(255)
    ellipse(500, 500, 20)
    ellipse(1470,825,50)
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
