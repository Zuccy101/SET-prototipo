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
  if (sceneID == 50) {
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
