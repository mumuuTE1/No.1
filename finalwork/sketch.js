
let player;
let floor;
let groundY;
let state = "start";


function setup() {
  createCanvas(windowWidth, windowHeight);
  resetgame();
}

function resetgame() {
  groundY = height * 0.9;

  player = {
    x: width * 0.5,
    y: groundY - width * 0.025,
    r: width * 0.025,
    vy: 0,
    grounded: true
  };

  floor = {
    x: width * 0.3,
    y: height * 0.35,
    w: player.r * 2.5,
    h: height * 0.025,
    speed: width * 0.025,
    direction: 1
  }
}

function draw() {
  background(235);

  // スタート画面・クリア画面
  if (state !== "playing") {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(width * 0.05);

    text(state === "start" ? "On the floor" : "CLEAR!",
         width/2, height*0.45);

    textSize(width * 0.025);
    text(state === "start" ? "CLICK TO START" : "CLICK TO RESTART",
         width/2, height*0.55);
    return;
  }

  // ジャンプ
  let jump = keyIsDown(UP_ARROW);

  if (jump && player.grounded) {
    player.vy = -height * 0.045;
    player.grounded = false;
  }

  // 左右移動
  if (keyIsDown(LEFT_ARROW)){player.x -= width * 0.02}
  if (keyIsDown(RIGHT_ARROW)){player.x += width * 0.02}

  player.x = constrain(player.x, player.r, width-player.r);

  // 床の往復
  floor.x += floor.speed * floor.direction

  if (floor.x + floor.w >= width || floor.x <= 0)
     {floor.direction *= -1;}

  // 重力
  let originalY = player.y
  player.vy += height * 0.0015
  player.y += player.vy
  player.grounded = false

  // 着地判定
  if (player.y + player.r >= groundY) {
    player.y = groundY - player.r
    player.vy = 0
    player.grounded = true
  }

  // 動く床の当たり判定
  if (
    player.x > floor.x &&
    player.x < floor.x + floor.w &&
    player.vy > 0 &&
    originalY + player.r <= floor.y &&
    player.y + player.r >= floor.y 
  ) 
  { state = "clear" }

  // 浮く床
  fill(50, 170, 220);
  rect(floor.x, floor.y, floor.w, floor.h);

  // 地面
  fill(100);
  rect(0, groundY, width, height-groundY);

  // プレイヤー
  fill(0, 100, 255);
  ellipse(player.x, player.y, player.r*2);
}

// クリックで開始・リスタート
function mousePressed() {
  if (state !== "playing") {
    resetgame()
    state = "playing"
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  resetgame()
  state = "start"
}
