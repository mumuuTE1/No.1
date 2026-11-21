
let player;
let guards = [];
let plants = [];
let treasure, goal;

let state = "start";
let moving = false;
let escapeStart, nextAdd = 3000;
let cellW, cellH;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellW = width / 27;
  cellH = height / 18;

  player = { x: width - cellW / 2, y: height - cellH / 2 };
  treasure = { x: cellW / 2, y: cellH / 2 };
  goal = { x: width - cellW / 2, y: height - cellH / 2 };

  plants = [
    { x: cellW * 6.75, y: cellH * 4.5 },
    { x: cellW * 20.25, y: cellH * 4.5 },
    { x: cellW * 6.75, y: cellH * 13.5 },
    { x: cellW * 20.25, y: cellH * 13.5 }
  ];
}

function addGuard() {
  guards.push({
    x: random(width * 0.2, width * 0.8),
    y: random(height * 0.1, height * 0.6),
    dir: random(360),
    time: millis(),
    hitTime: 0
  });
}

function draw() {
  background(255);
  cellW = width / 27;
  cellH = height / 18;

  // マス目
  stroke(180);
  for (let i = 1; i < 27; i++) line(cellW * i, 0, cellW * i, height);
  for (let i = 1; i < 18; i++) line(0, cellH * i, width, cellH * i);
  noStroke();

  // 植物とEXIT
  fill(30, 150, 50);
  for (let p of plants) rect(p.x - cellW / 2, p.y - cellH / 2, cellW, cellH);
  rect(width - cellW, height - cellH, cellW, cellH);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("EXIT", goal.x, goal.y);

  // スタート画面
  if (state == "start") {
    fill(0);
    textSize(30);
    text("THIEF GAME", width / 2, height * 0.4);
    textSize(18);
    text("Press ENTER to start", width / 2, height * 0.5);
    return;
  }

  if (state == "play" || state == "escape") {
    // プレイヤーの移動（速度2倍）
    moving = false;
    if (keyIsDown(LEFT_ARROW)) { player.x -= 12; moving = true; }
    if (keyIsDown(RIGHT_ARROW)) { player.x += 12; moving = true; }
    if (keyIsDown(UP_ARROW)) { player.y -= 12; moving = true; }
    if (keyIsDown(DOWN_ARROW)) { player.y += 12; moving = true; }

    player.x = constrain(player.x, 0, width);
    player.y = constrain(player.y, 0, height);

    // 警備員
    for (let g of guards) {
      if (millis() - g.time > 2000) {
        g.dir = random(360);
        g.time = millis();
      }

      // 警備員の速度2倍
      let speed = state == "escape" ? 12 : 6;
      g.x += cos(radians(g.dir)) * speed;
      g.y += sin(radians(g.dir)) * speed;

      // 画面端
      if (g.x < 20 || g.x > width - 20 || g.y < 20 || g.y > height - 20) {
        g.x = constrain(g.x, 20, width - 20);
        g.y = constrain(g.y, 20, height - 20);
        g.dir = random(360);
      }

      // プレイヤーとの衝突
      if (dist(g.x, g.y, player.x, player.y) < 30 && millis() - g.hitTime > 500) {
        g.dir = random(360);
        g.hitTime = millis();
      }

      // ライト
      push();
      translate(g.x, g.y);
      rotate(radians(g.dir));
      fill(255, 220, 0, 70);
      rect(0, -30, 200, 60);
      pop();

      // ライトに照らされたか
      if (moving) {
        let dx = player.x - g.x;
        let dy = player.y - g.y;
        let angle = radians(g.dir);
        let localX = dx * cos(angle) + dy * sin(angle);
        let localY = -dx * sin(angle) + dy * cos(angle);

        if (localX > 0 && localX < 200 && abs(localY) < 30) state = "over";
      }

      // 警備員の姿
      fill(30, 80, 180);
      rect(g.x - 20, g.y - 20, 40, 40);
      fill(0);
      ellipse(g.x, g.y, 20, 20);
    }

    // 警備員同士の衝突
    for (let i = 0; i < guards.length; i++) {
      for (let j = i + 1; j < guards.length; j++) {
        let a = guards[i], b = guards[j];

        if (dist(a.x, a.y, b.x, b.y) < 40 &&
            millis() - a.hitTime > 500 && millis() - b.hitTime > 500) {
          a.dir = random(360);
          b.dir = random(360);
          a.hitTime = millis();
          b.hitTime = millis();
        }
      }
    }

    // 宝
    if (state == "play") {
      fill(255, 190, 0);
      quad(treasure.x, treasure.y - 15, treasure.x + 12, treasure.y,
           treasure.x, treasure.y + 15, treasure.x - 12, treasure.y);

      if (dist(player.x, player.y, treasure.x, treasure.y) < 25) {
        state = "escape";
        escapeStart = millis();
      }
    }

    // 脱出
    if (state == "escape") {
      let elapsed = millis() - escapeStart;

      if (elapsed >= nextAdd) {
        addGuard();
        addGuard();
        nextAdd += 3000;
      }

      if (elapsed > 30000) state = "over";

      fill(0);
      textSize(18);
      text("ESCAPE!", width / 2, 30);
      text("TIME: " + floor((30000 - elapsed) / 1000), width / 2, 55);

      if (player.x >= width - cellW && player.y >= height - cellH) state = "clear";
    }

    // プレイヤーの姿
    fill(moving ? 0 : color(30, 150, 50));
    if (moving) ellipse(player.x, player.y, 36, 36);
    else rect(player.x - cellW / 2, player.y - cellH / 2, cellW, cellH);
  }

  // 結果表示
  if (state == "clear" || state == "over") {
    fill(0);
    textSize(32);
    text(state == "clear" ? "CLEAR!" : "GAME OVER", width / 2, height / 2);
    textSize(18);
    text("Press ENTER to restart", width / 2, height / 2 + 50);
  }
}

function keyPressed() {
  if (key === "Enter" && (state == "start" || state == "clear" || state == "over")) {
    guards = [];
    for (let i = 0; i < 5; i++) addGuard();

    player.x = width - cellW / 2;
    player.y = height - cellH / 2;
    nextAdd = 3000;
    state = "play";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellW = width / 27;
  cellH = height / 18;
  goal.x = width - cellW / 2;
  goal.y = height - cellH / 2;
}
