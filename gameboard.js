let tile;
let frameMarker;
let retryFrames;
let spriteSelect;
let cardSpriteSheet;
let frameSpriteSheet;
let alphabetSpriteSheet;
let charData = {
  A: { x: 0, w: 10 },
  B: { x: 10, w: 10 },
  C: { x: 20, w: 10 },
  D: { x: 30, w: 10 },
  E: { x: 40, w: 9 },
  F: { x: 49, w: 9 },
  G: { x: 58, w: 10 },
  H: { x: 68, w: 10 },
  I: { x: 78, w: 5 },
  J: { x: 83, w: 10 },
  K: { x: 93, w: 11 },
  L: { x: 104, w: 9 },
  M: { x: 113, w: 12 },
  N: { x: 125, w: 12 },
  O: { x: 137, w: 10 },
  P: { x: 147, w: 10 },
  Q: { x: 157, w: 10 },
  R: { x: 167, w: 10 },
  S: { x: 177, w: 10 },
  T: { x: 187, w: 11 },
  U: { x: 198, w: 10 },
  V: { x: 208, w: 11 },
  W: { x: 219, w: 15 },
  X: { x: 234, w: 11 },
  Y: { x: 245, w: 11 },
  Z: { x: 256, w: 10 },
  1: { x: 266, w: 6 },
  2: { x: 272, w: 10},
  3: { x: 282, w: 10},
  4: { x: 292, w: 10},
  5: { x: 302, w: 10},
  6: { x: 312, w: 10},
  7: { x: 322, w: 9},
  8: { x: 331, w: 10},
  9: { x: 341, w: 10},
  0: { x: 351, w: 10},
  "?": { x: 361, w: 9},
  "!": { x: 370, w: 5},
  ":": { x: 375, w: 5},
  ";": { x: 380, w: 5},
  ".": { x: 385, w: 5},
  ",": { x: 390, w: 5},
  "_": { x: 395, w: 8},
  "'": { x: 403, w: 5},
  '"': { x: 408, w: 5},
  "/": { x: 413, w: 8},
  "+": { x: 421, w: 12},
  "-": { x: 433, w: 12},
  "<": { x: 445, w: 8},
  ">": { x: 453, w: 8},
  "(": { x: 461, w: 7},
  ")": { x: 468, w: 7},
  "[": { x: 475, w: 7},
  "]": { x: 482, w: 7},
  " ": { x: 489, w: 4 },
};

let w = 49;
let h = 64;
let clickedUI = false;
let clickID;
let interactID = 0;

function preload() {
  alphabetSpriteSheet = loadImage("assets/fontspritesheet.png");
  frameSpriteSheet = loadImage("assets/cardframes.png");
  cardSpriteSheet = loadImage("assets/spritesheet.png");
  spriteSelect = loadImage("assets/spriteselect.png");
  frameMarker = loadImage("assets/framemarker.png");
  retryFrames = loadImage("assets/retryframes.png");
  tile = loadImage("assets/bgtile.png");
}

function draw() {
  background("#85daeb");

  smooth();
  drawBackground();
  noSmooth();

  manageInterface();
  if (sceneID == 21) {
    manageGame()
    manageSets()
    drawDebug();
  }

}

function keyPressed() {
  if (keyCode == ENTER) {
    usedDeck = [];
    setupDeck();
    pullCards(0);
    setupFrames();
  }
}

function drawDebug() {

  fill(0);
  textAlign(LEFT);
  textSize(9);

  for (let i = 0; i < allSets.length; i++) {
    text(
      allSets[i].first + " " +
      allSets[i].second + " " +
      allSets[i].last + "   " +
      allSets[i].setID,
      5,
      10 + 10 * i
    );
  }

  for (let i = 0; i < deck.length; i++) {
    text(
      deck[i].shape + "" +
        deck[i].amount + "" +
        deck[i].fill + "" +
        deck[i].col + "   " +
        deck[i].cardID,
      70,
      10 + 9.25 * i
    );
  }

  for (let i = 0; i < currentDeck.length; i++) {
    text(
      currentDeck[i].shape + "" +
        currentDeck[i].amount + "" +
        currentDeck[i].fill + "" +
        currentDeck[i].col + "   " +
        currentDeck[i].cardID,
      120,
      10 + 10 * i
    );
  }

  for (let i = 0; i < currentSets.length; i++) {
    text(
      currentSets[i].first + " " +
        currentSets[i].second + " " +
        currentSets[i].last + "  " +
        currentSets[i].setID,
      180,
      10 + 10 * i
    );
  }
}

function drawFrame(frame) {

  image(
    frameSpriteSheet,
    frame.x,
    frame.y + (frame.press * frame.size),
    frame.w * frame.size,
    frame.h * frame.size,
    49 * frame.state,
    0,
    49,
    64
  );

  textAlign(LEFT, TOP)
  textSize(8 * frame.size)
  text(frame.cardID, frame.x + 16, frame.y + 16)
}

function drawCard(frame, card) {
  image(
    cardSpriteSheet,
    frame.x,
    frame.y + (frame.press * frame.size),
    frame.w * frame.size,
    frame.h * frame.size,
    frame.w * card.amount + (147 * card.col),
    frame.h * card.shape + (192 * card.fill),
    frame.w,
    frame.h
  )
}

function drawUI(x, y, strw, h, margin, size, col, press, string) {
  
  
  let xPos = x - strw / 2;
  let yPos = (y - h * size / 2) + (press * size)
  let yOffset = (col * h) + (press * h * 5);
  
  for (let i = 0; i < string.length; i++) {
    let char = string[i];
    if (charData[char]) {
      let { x: sx, w } = charData[char];
      image(
        alphabetSpriteSheet, 
        xPos, 
        yPos, 
        w * size, 
        h * size, 
        sx, 
        yOffset, 
        w, 
        h
      );
      
      xPos += w * size + margin;
    }
  }
}

function drawSelect(bounds, size, press) {

  let selectSize = size;
  let w = 11;
  let h = 12;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {

      image(
        spriteSelect,
        bounds.x - (w * selectSize) + (i * (bounds.w + spriteSelect.width * selectSize / 4)),
        bounds.y - (h * selectSize) + (j * (bounds.h + spriteSelect.height * selectSize / 2)),
        w * selectSize,
        h * selectSize,
        i * w + (spriteSelect.width / 2 * press),
        j * h,
        w,
        h
      )

      /*strokeWeight(5)
      rect(bounds.x, bounds.y, bounds.w, bounds.h)
      point(
        bounds.x - (w * selectSize) + (i * (bounds.w + spriteSelect.width * selectSize / 4)),
        bounds.y - (h * selectSize) + (j * (bounds.h + spriteSelect.height * selectSize / 2)),
      )*/
    }
  }
}

