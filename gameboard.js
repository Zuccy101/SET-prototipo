let cardSpriteSheet;
let frameSpriteSheet;
let frameMarker;
let retryFrames;

let w = 49;
let h = 64;

function preload() {
  alphabetSpriteSheet = loadImage("assets/fontspritesheet.png");
  frameSpriteSheet = loadImage("assets/cardframes.png");
  cardSpriteSheet = loadImage("assets/spritesheet.png");
  frameMarker = loadImage("assets/framemarker.png")
  retryFrames = loadImage("assets/retryframes.png")
  tile = loadImage("assets/bgtile.png");
}

function draw() {
  background("#85daeb");

  smooth();
  drawBackground();
  noSmooth();

  //drawInterface();
  if (sceneID == 10) {
    manageGame();
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
    frame.y + frame.press,
    w * frame.size,
    h * frame.size,
    w * frame.state,
    0,
    w,
    h
  );

  textAlign(LEFT, TOP)
  textSize(8 * frame.size)
  text(frame.cardID, frame.x + 16, frame.y + 16)
}

function drawCard(x, y, size, press, card) {
  image(
    cardSpriteSheet,
    x,
    y + press,
    w * size,
    h * size,
    w * card.amount + (147 * card.col),
    h * card.shape + (192 * card.fill),
    w,
    h
  )
}

function drawMarker(x, y, fw, fh, size, state) {
  image(
    frameMarker,
    x - 21,
    y - 24,
    fw * size,
    fh * size,
    fw * state,
    0,
    fw,
    fh
  )
}

function drawInterface() {
  image(
    retryFrames,
    width - retryFrames.width * 2,
    retryFrames.width,
    14 * 4,
    16 * 4,
    14 * 0,
    0,
    14,
    16
  )
}
