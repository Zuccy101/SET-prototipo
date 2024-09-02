let tile;
let frameMarker;
let retryFrames;
let spriteSelect;
let cardSpriteSheet;
let frameSpriteSheet;
let alphabetSpriteSheet;

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