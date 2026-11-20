// 最終課題を制作しよう


let player;
let guards = [];
let plants = [];

let treasure;
let goal;
let wall;

let gameState = "start";

let startTime;
let timeLimit = 30;

let guardSpeed = 0.0015;
let playerSpeed = 0.004;

let guardCount = 3;

// 画面サイズに依存する基本単位
function unit() {
  return min(width, height);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  initializeGame();
}

function initializeGame() {

  // プレイヤー
  player = {
    x: 0.04,
    y: 0.5,
    r: 0.014,
    moving: false
  };

  // 宝
  treasure = {
    x: 0.5,
    y: 0.5,
    r: 0.025
  };

  // ゴール
  goal = {
    x: 0.94,
    y: 0.9,
    r: 0.035
  };

  // 壁（右端から画面中央方向へ）
  wall = {
    x1: 0.5,
    x2: 1.0,
    y: 0.72,
    thickness: 0.025
  };

  // 植物を3か所に設置
  plants = [
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.25 },
    { x: 0.25, y: 0.75 }
  ];

  guards = [];

  guardSpeed = 0.0015;
  guardCount = 3;

  // 警備員を配置
  for (let i = 0; i < guardCount; i++) {
    addGuard();
  }
}

function addGuard() {

  let g = {
    x: random(0.2, 0.85),
    y: random(0.15, 0.85),

    angle: random(TWO_PI),

    lastTurn: millis(),

    speed: guardSpeed
  };

  guards.push(g);
}

// ----------------------------------
// draw
// ----------------------------------

function draw() {

  background(160, 192, 255);

  if (gameState === "start") {
    drawStartScreen();
  }

  else if (gameState === "playing") {
    playGame();
  }

  else if (gameState === "escape") {
    escapeGame();
  }

  else if (gameState === "clear") {
    drawResult("GAME CLEAR!", "宝を盗み、無事に脱出した！");
  }

  else if (gameState === "over") {
    drawResult("GAME OVER", "警備員に見つかった、または時間切れ！");
  }
}

// ----------------------------------
// ゲーム画面
// ----------------------------------

function drawWorld() {

  // 植物
  for (let p of plants) {
    drawPlant(p);
  }

  // 壁
  fill(75, 75, 85);
  noStroke();

  rect(
    wall.x1 * width,
    wall.y * height - wall.thickness * unit() / 2,
    (wall.x2 - wall.x1) * width,
    wall.thickness * unit()
  );

  // 宝
  drawTreasure();

  // ゴール
  drawGoal();

  // 警備員のライト
  for (let g of guards) {
    drawLight(g);
  }

  // 警備員
  for (let g of guards) {
    drawGuard(g);
  }

  // プレイヤー
  drawPlayer();
}

// ----------------------------------
// 植物
// ----------------------------------

function drawPlant(p) {

  let x = p.x * width;
  let y = p.y * height;
  let s = unit();

  noStroke();

  fill(30, 130, 55);

  ellipse(x - s * 0.012, y, s * 0.035, s * 0.018);
  ellipse(x + s * 0.012, y, s * 0.035, s * 0.018);

  fill(20, 100, 40);
  rect(x - s * 0.004, y, s * 0.008, s * 0.025);
}

// ----------------------------------
// 宝
// ----------------------------------

function drawTreasure() {

  let x = treasure.x * width;
  let y = treasure.y * height;
  let s = unit();

  fill(255, 210, 40);
  stroke(150, 100, 0);
  strokeWeight(2);

  rectMode(CENTER);
  rect(x, y, s * 0.045, s * 0.035);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(s * 0.025);
  text("★", x, y);
}

// ----------------------------------
// ゴール
// ----------------------------------

function drawGoal() {

  let x = goal.x * width;
  let y = goal.y * height;
  let s = unit();

  fill(30, 180, 100);
  stroke(255);
  strokeWeight(3);

  rectMode(CENTER);
  rect(x, y, s * 0.07, s * 0.07);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(s * 0.018);
  text("GOAL", x, y);
}

// ----------------------------------
// 警備員のライト
// ----------------------------------

function drawLight(g) {

  let x = g.x * width;
  let y = g.y * height;

  let s = unit();

  push();

  translate(x, y);
  rotate(g.angle);

  noStroke();
  fill(255, 255, 100, 65);

  // 前方に伸びる長方形のライト
  rectMode(CORNER);

  rect(
    s * 0.018,
    -s * 0.045,
    s * 0.20,
    s * 0.09
  );

  pop();
}

// ----------------------------------
// 警備員
// ----------------------------------

function drawGuard(g) {

  let x = g.x * width;
  let y = g.y * height;
  let s = unit();

  push();

  translate(x, y);
  rotate(g.angle);

  noStroke();

  fill(190, 40, 40);
  rectMode(CENTER);
  rect(0, 0, s * 0.035, s * 0.025);

  // 向きを示すライト部分
  fill(255, 240, 100);
  ellipse(s * 0.018, 0, s * 0.012);

  pop();
}

// ----------------------------------
// プレイヤー
// ----------------------------------

function drawPlayer() {

  let x = player.x * width;
  let y = player.y * height;
  let s = unit();

  noStroke();

  if (player.moving) {
    fill(30, 30, 30);
  } else {
    // 停止中は植物に擬態
    fill(20, 130, 45);
  }

  rectMode(CENTER);
  rect(x, y, s * 0.025, s * 0.025);
}

// ----------------------------------
// プレイヤー移動
// ----------------------------------

function movePlayer() {

  let dx = 0;
  let dy = 0;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    dx--;
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    dx++;
  }

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    dy--;
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    dy++;
  }

  player.moving = dx !== 0 || dy !== 0;

  if (player.moving) {

    // 斜め移動の速度を調整
    let mag = sqrt(dx * dx + dy * dy);

    dx /= mag;
    dy /= mag;

    let oldX = player.x;
    let oldY = player.y;

    player.x += dx * playerSpeed;
    player.y += dy * playerSpeed;

    // 画面外に出ないようにする
    player.x = constrain(player.x, 0.015, 0.985);
    player.y = constrain(player.y, 0.015, 0.985);

    // 壁との衝突
    if (playerHitsWall()) {
      player.x = oldX;
      player.y = oldY;
    }
  }
}

// ----------------------------------
// 壁との衝突判定
// ----------------------------------

function playerHitsWall() {

  let px = player.x * width;
  let py = player.y * height;

  let s = unit();

  let left = wall.x1 * width;
  let right = wall.x2 * width;

  let wy = wall.y * height;
  let thick = wall.thickness * s;

  return (
    px + player.r * s > left &&
    px - player.r * s < right &&
    py + player.r * s > wy - thick / 2 &&
    py - player.r * s < wy + thick / 2
  );
}

// ----------------------------------
// 警備員の移動
// ----------------------------------

function updateGuards() {

  for (let g of guards) {

    let oldX = g.x;
    let oldY = g.y;

    // 2秒ごとに方向転換
    if (millis() - g.lastTurn > 2000) {
      turnGuard(g);
    }

    g.x += cos(g.angle) * g.speed;
    g.y += sin(g.angle) * g.speed;

    // 画面端に当たった場合
    if (
      g.x < 0.02 || g.x > 0.98 ||
      g.y < 0.02 || g.y > 0.98
    ) {
      g.x = oldX;
      g.y = oldY;
      turnGuard(g);
    }

    // 壁に当たった場合
    if (guardHitsWall(g)) {
      g.x = oldX;
      g.y = oldY;
      turnGuard(g);
    }

    // プレイヤーに当たった場合
    let d = dist(
      g.x * width,
      g.y * height,
      player.x * width,
      player.y * height
    );

    if (d < unit() * 0.04) {
      turnGuard(g);
    }
  }
}

function turnGuard(g) {

  g.angle = random(TWO_PI);
  g.lastTurn = millis();
}

// ----------------------------------
// 警備員と壁の衝突
// ----------------------------------

function guardHitsWall(g) {

  let gx = g.x * width;
  let gy = g.y * height;

  let left = wall.x1 * width;
  let right = wall.x2 * width;

  let wy = wall.y * height;

  return (
    gx > left &&
    gx < right &&
    abs(gy - wy) < wall.thickness * unit() / 2
  );
}

// ----------------------------------
// ライトの範囲内にいるか
// ----------------------------------

function isInLight(g) {

  let dx = (player.x - g.x) * width;
  let dy = (player.y - g.y) * height;

  let forward = dx * cos(g.angle) + dy * sin(g.angle);

  let side = -dx * sin(g.angle) + dy * cos(g.angle);

  let s = unit();

  return (
    forward > 0 &&
    forward < s * 0.20 &&
    abs(side) < s * 0.045
  );
}

// ----------------------------------
// ゲーム進行
// ----------------------------------

function playGame() {

  movePlayer();
  updateGuards();

  drawWorld();

  // ライトに照らされて動いたら発見
  for (let g of guards) {

    if (isInLight(g) && player.moving) {
      gameState = "over";
    }
  }

  // 宝を取得
  if (
    dist(
      player.x * width,
      player.y * height,
      treasure.x * width,
      treasure.y * height
    ) < unit() * 0.04
  ) {
    startEscape();
  }

  drawHUD();
}

// ----------------------------------
// 宝を取った後
// ----------------------------------

function startEscape() {

  gameState = "escape";

  // 警備員を2人追加
  addGuard();
  addGuard();

  // 移動速度を上げる
  guardSpeed *= 1.5;

  for (let g of guards) {
    g.speed = guardSpeed;
  }

  startTime = millis();
}

// ----------------------------------
// 脱出フェーズ
// ----------------------------------

function escapeGame() {

  movePlayer();
  updateGuards();

  drawWorld();

  // ライトに照らされて動いたら発見
  for (let g of guards) {

    if (isInLight(g) && player.moving) {
      gameState = "over";
    }
  }

  // ゴール判定
  let d = dist(
    player.x * width,
    player.y * height,
    goal.x * width,
    goal.y * height
  );

  if (d < unit() * 0.055) {
    gameState = "clear";
  }

  // 残り時間
  let remaining = timeLimit - (millis() - startTime) / 1000;

  if (remaining <= 0) {
    gameState = "over";
  }

  drawHUD(remaining);
}

// ----------------------------------
// HUD
// ----------------------------------

function drawHUD(remaining) {

  fill(30);
  noStroke();

  textAlign(LEFT, TOP);
  textSize(unit() * 0.022);

  if (gameState === "playing") {
    text("TREASURE: STEAL IT!", 20, 20);
  }

  if (gameState === "escape") {
    text("ESCAPE TIME: " + max(0, ceil(remaining)), 20, 20);
    text("GUARDS: " + guards.length, 20, 50);
  }
}

// ----------------------------------
// スタート画面
// ----------------------------------

function drawStartScreen() {

  fill(30);
  textAlign(CENTER, CENTER);

  textSize(unit() * 0.055);
  text("THE GREAT THIEF", width / 2, height * 0.32);

  textSize(unit() * 0.022);

  text(
    "警備員のライトを避けて、中央の宝を盗み出せ！",
    width / 2,
    height * 0.44
  );

  text(
    "光の中でも、止まっていれば植物に擬態できる。",
    width / 2,
    height * 0.49
  );

  text(
    "宝を盗んだら、右下のゴールへ急げ！",
    width / 2,
    height * 0.54
  );

  text(
    "操作：WASD / 矢印キー",
    width / 2,
    height * 0.62
  );

  text(
    "ENTER でスタート",
    width / 2,
    height * 0.72
  );
}

// ----------------------------------
// 結果画面
// ----------------------------------

function drawResult(title, message) {

  fill(30);
  textAlign(CENTER, CENTER);

  textSize(unit() * 0.06);
  text(title, width / 2, height * 0.4);

  textSize(unit() * 0.025);
  text(message, width / 2, height * 0.52);

  textSize(unit() * 0.02);
  text("ENTER で再スタート", width / 2, height * 0.65);
}

// ----------------------------------
// キー入力
// ----------------------------------

function keyPressed() {

  if (keyCode === ENTER) {

    if (gameState === "start") {
      gameState = "playing";
    }

    else if (gameState === "clear" || gameState === "over") {
      initializeGame();
      gameState = "playing";
    }
  }

  return false;
}

// ----------------------------------
// 画面サイズ変更
// ----------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


