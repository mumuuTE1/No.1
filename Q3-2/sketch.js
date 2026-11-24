// 2D アニメーションゲームのようなインタラクション
let x, y;
let vx, vy;
const g = 1;
let m = 5

function setup(){
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;
  vx = 0;
  vy = 0;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  background(160, 192, 255);
  const size = height * 0.1; // キャラクターのサイズ

  // 地面を描く
  const groundY = height * 0.8;
  fill(64, 192, 64);
  rect(0, groundY, width, height - groundY);

  // BLANK[1] キャラクターの左右移動
  
if (keyIsDown("a".charAt(0))){ m = 20}   
if (keyIsDown(LEFT_ARROW)){ x -= m;}
if (keyIsDown(RIGHT_ARROW)){ x += m;}
else (m = 5)
 
console.log("m=" + m);

  // 速くなりすぎないように制限
   
  vx = constrain(vx, -20, 20);
  vy = constrain(vy, -20, 20);
 
  // 位置を更新
  x += vx;
  y += vy;
  vy += g
 x = constrain(x,0+size/2,width-size/2) 
 y = constrain(y,0,groundY-size/2)
 
  // キャラクターを描く
  fill(0);
  ellipse(x, y, size);
}

    // BLANK[2] 重力とジャンプ
function keyPressed(){
if(key ==' '){if(y == height*0.8-height*0.1/2){vy = vy * -1 }}
}
