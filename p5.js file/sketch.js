let particles = [];
let shockwaves = [];

let angleOffset = 0;
let noiseOffset = 0;

let energy = 1;
let flashAlpha = 0;

// Sound variable
let rasenganSound;

function preload() {
  // Load your Rasengan sound file
  // Make sure rasengan.mp3 is in your sketch folder
  rasenganSound = loadSound('rasengan.mp3');
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(5, 5, 15);

  drawChakraField();

  // Smooth energy recovery
  energy = lerp(energy, 1, 0.05);

  blendMode(ADD);
  drawRasengan(width / 2, height / 2);
  updateParticles();
  updateShockwaves();
  blendMode(BLEND);

  // Flash overlay if firing
  if (flashAlpha > 0) {
    fill(200, 220, 255, flashAlpha);
    noStroke();
    rect(0, 0, width, height);
    flashAlpha *= 0.85;
  }
}

// Click to fire Rasengan
function mousePressed() {
  shockwaves.push(new Shockwave(width / 2, height / 2));
  energy = 0.4;

  flashAlpha = 180;

  if (rasenganSound) {
    rasenganSound.play();
  }
}

// Background chakra flow
function drawChakraField() {
  noStroke();

  for (let y = 0; y < height; y += 12) {
    let xoff = 0;
    beginShape();
    fill(0, 120, 255, 25);

    for (let x = 0; x <= width; x += 12) {
      let n = noise(xoff, noiseOffset + y * 0.01);
      let yPos = y + n * 20;
      vertex(x, yPos);
      xoff += 0.05;
    }

    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }

  noiseOffset += 0.01;
}

// Rasengan
function drawRasengan(cx, cy) {
  push();
  translate(cx, cy);

  for (let r = 140; r > 20; r -= 8) {
    fill(80, 180, 255, 18);
    ellipse(0, 0, r * energy);
  }

  stroke(150, 220, 255);
  strokeWeight(2);
  noFill();

  for (let i = 0; i < 80; i++) {
    let angle = angleOffset + i * 0.2;
    let baseRadius = 90 * energy;
    let variation = map(noise(i * 0.05, frameCount * 0.02), 0, 1, -10, 10);
    let radius = baseRadius + variation;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    point(x, y);

    if (random() < 0.04) {
      particles.push(new Particle(cx + x, cy + y));
    }
  }

  stroke(200, 240, 255);
  for (let i = 0; i < 40; i++) {
    let angle = -angleOffset * 1.5 + i * 0.3;
    let radius = (40 + sin(frameCount * 0.1 + i) * 5) * energy;

    point(cos(angle) * radius, sin(angle) * radius);
  }

  angleOffset += 0.05;
  pop();
}

// Particle class
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.life = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 4;
  }

  show() {
    noStroke();
    fill(120, 200, 255, this.life);
    ellipse(this.pos.x, this.pos.y, 3);
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Shockwave class
class Shockwave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.alpha = 255;
    this.speed = 12;
  }

  update() {
    this.radius += this.speed;
    this.alpha -= 6;
  }

  show() {
    noFill();
    stroke(120, 200, 255, this.alpha);
    strokeWeight(3);
    ellipse(this.x, this.y, this.radius);
  }

  isDead() {
    return this.alpha <= 0;
  }
}

function updateShockwaves() {
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].update();
    shockwaves[i].show();

    if (shockwaves[i].isDead()) {
      shockwaves.splice(i, 1);
    }
  }
}