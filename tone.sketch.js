let synth = null;
let circles = [];
let started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
}

function draw() {
  if (!started) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Click to start audio", width / 2, height / 2);
    return;
  }

  background(20, 20, 30, 40);

  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];

    fill(c.color);
    noStroke();
    ellipse(c.x, c.y, c.size);

    c.size += 2;
    c.alpha -= 3;

    if (c.alpha <= 0) {
      circles.splice(i, 1);
    } else {
      c.color.setAlpha(c.alpha);
    }
  }
}

function mousePressed() {
                    
  if (!started) {
    Tone.start();
    synth = new Tone.Synth().toDestination();
    started = true;
  }


  let notes = ["C4", "D4", "E4", "G4", "A4"];
  let index = floor(map(mouseX, 0, width, 0, notes.length));
  index = constrain(index, 0, notes.length - 1);

  synth.triggerAttackRelease(notes[index], "8n");

  circles.push({
    x: mouseX,
    y: mouseY,
    size: 20,
    alpha: 255,
    color: color(random(100, 255), random(100, 255), random(100, 255))
  });
}
                    