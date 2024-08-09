let deck = [];
let allUI = [];
let allSets = [];
let usedDeck = [];
let allFrames = [];
let currentDeck = [];
let currentSets = [];
let obtainedSets = [];
let obtainedCards = [];
let obtainedFrames = [];

let win = false;
let sceneID = 0;
let margin = 2;
let cardID = 0;
let setID = 0;

let cnv;

class CARD {
  constructor(shape, amount, fill, col, cardID) {  //CARD CLASS
    this.shape = shape;
    this.amount = amount;
    this.fill = fill;
    this.col = col;

    this.cardID = cardID;
  }
}

class SET {
  constructor(first, second, last, setID) {  //SET CLASS
    this.first = first;
    this.second = second;
    this.last = last;

    this.setID = setID;
  }
}


class FRAME {
  constructor(x, y, size, state, cardID) {  //FRAME CLASS
    this.x = x;
    this.y = y;
    this.w = 49;
    this.h = 64;
    
    this.size = size;
    this.state = state;
    this.press = 0;
    
    this.cardID = cardID;
  }
}

class BOUNDARY {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

class UI {
  constructor(x, y, size, col, clickable, sceneID, string, interact) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.col = col;
    this.press = 0;

    this.clickable = clickable;
    this.interact = interact;
    this.sceneID = sceneID;
    this.string = string;
  }
}

class ANIMATION {
  constructor(targets, startX, startY, startS, endX, endY, endS, duration, type) {
    this.targets = targets;
    this.startX = startX;
    this.startY = startY;
    this.startS = startS;
    this.endX = endX;
    this.endY = endY;
    this.endS = endS;
    this.duration = duration;
    this.startTime = millis();
    this.type = type;
  }

  play() {
    let elapsedTime = millis() - this.startTime;
    let progress = min(elapsedTime / this.duration, 1);
    progress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    if (this.type === 'move-to-side') {

      this.targets.forEach((frame, index) => {
        frame.x = lerp(this.startX[index], this.endX[index], progress);
        frame.y = lerp(this.startY[index], this.endY[index], progress);
        frame.size = lerp(this.startS, this.endS, progress);
      });
    } else if (this.type === 'push-down') {
      this.targets.forEach((frame, index) => {
        frame.x = lerp(this.startX, this.endX, progress);
        frame.y = lerp(this.startY + index * (frame.h + 7), this.endY + index * (frame.h + 7), progress);
        frame.size = lerp(this.startS, this.endS, progress);
      });
    }
  }

  done() {
    return millis() - this.startTime >= this.duration;
  }
}

class STACK {
  constructor(f1, f2, f3, playerID) {
    this.frames = [f1, f2, f3];
    this.saved = false;
    this.playerID = playerID;
    this.animations = [];
  }

  update() {
    this.animations = this.animations.filter(anim => {
      
      anim.play();
      return (!anim.done());
    });
  }
  
  draw() {
    this.frames.forEach((frame, index) => {
      drawFrame(frame);
      drawCard(frame, deck[frame.cardID - 1]);
    });
  }
  
  animate(animation) {
    this.animations.push(animation);
    console.log(this.animations.length)
  }
}

function setup() {

  cnv = createCanvas(1024, 768);
  cnv.parent("canvasParent")

  setupInterface();
  setupCards();
  setupDeck();
  pullCards(0);
  setupFrames();

  console.log("All sets length: " + allSets.length);
  
}

function generateSets(deck) {     //CREATE ALL 1080 SETS FROM DECK ARRAY

  let sets = [];
  for (let i = 0; i < deck.length - 2; i++) {
    for (let j = i + 1; j < deck.length - 1; j++) {
      for (let k = j + 1; k < deck.length; k++) {
        if (validate(deck[i], deck[j], deck[k])) {
          setID++;
          let newSet = new SET(deck[i].cardID, deck[j].cardID, deck[k].cardID, setID);
          sets.push(newSet);
        }
      }
    }
  }
  return sets;
}
  
function findSets(currentDeck, allSets) {     //FIND SETS IN CURRENT DECK OF 12 CARDS

  let sets = [];
  for (let i = 0; i < currentDeck.length - 2; i++) {
    for (let j = i + 1; j < currentDeck.length - 1; j++) {
      for (let k = j + 1; k < currentDeck.length; k++) {
        if (validate(currentDeck[i], currentDeck[j], currentDeck[k])) {
          let currentSet = new SET(currentDeck[i].cardID, currentDeck[j].cardID, currentDeck[k].cardID, 0);
          currentSet = sortSet(currentSet);
          let foundSet = allSets.find(set =>
            set.first === currentSet.first && set.second === currentSet.second && set.last === currentSet.last);

          if (foundSet) {
            sets.push(foundSet);
          }
        }
      }
    }
  }
  return sets;
}

function sortSet(set) {
  
  let setList = [set.first, set.second, set.last].sort((a, b) => a - b);  //SORTS THE VALID SETS FOUND AND COMPARES TO ALL SETS
  return new SET(setList[0], setList[1], setList[2], set.setID);
}

function validate(card1, card2, card3) {

  return (
    recognizePattern(card1.shape, card2.shape, card3.shape) &&
    recognizePattern(card1.amount, card2.amount, card3.amount) &&
    recognizePattern(card1.fill, card2.fill, card3.fill) &&
    recognizePattern(card1.col, card2.col, card3.col)
  );
}

function recognizePattern(a, b, c) {

  return (a === b && b === c) || (a !== b && b !== c && a !== c);
}

function setupCards() {

  deck = [];

  for (let x = 0; x < 3; x++) {     //CREATE ALL 81 CARDS, PUSH IN DECK
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        for (let w = 0; w < 3; w++) {
          cardID++;
          let newCard = new CARD(x, y, z, w, cardID);
          deck.push(newCard);
        }
      }
    }
  }
  
  allSets = generateSets(deck);
}

function setupDeck() {
  
  currentDeck = [];

  for (let i = 0; i < 12; i++) {
    let randomIndex;
    let currentCard;

    do {
      randomIndex = Math.floor(Math.random() * deck.length);  //PICK 12 RANDOM CARDS FROM DECK
      currentCard = deck[randomIndex];
    }
    while (currentDeck.includes(currentCard))
    currentDeck.push(currentCard);
  }
  
  currentSets = findSets(currentDeck, allSets);     //FIND SETS IN CURRENT DECK

}

function pullCards(ingame) {

  let randomIndex;
  let currentCard;

  switch(ingame) {
    case 0:
      while (currentSets.length === 0 && deck.length >= 3) {
        for (let i = 0; i < 3; i++) {
      
          do {
            randomIndex = Math.floor(Math.random() * deck.length);  //PICK 3 RANDOM CARDS FROM DECK
            currentCard = deck[randomIndex];
          }
          while (currentDeck.includes(currentCard))
      
          currentDeck.push(currentCard);
        }
        currentSets = findSets(currentDeck, allSets);     //FIND SETS IN NEW CURRENT DECK
      }
      break;

    case 1:
      if (usedDeck.length < 69) {
        for (let i = 0; i < cardIndexes.length; i++) {
  
          do {
            randomIndex = Math.floor(Math.random() * deck.length);  //PICK 3 RANDOM CARDS FROM DECK
            currentCard = deck[randomIndex];
          }
          while (currentDeck.includes(currentCard) || usedDeck.includes(currentCard))
      
          currentDeck.splice(cardIndexes[i], 0, currentCard);
        }
        currentSets = findSets(currentDeck, allSets);
        if (currentSets.length < 1) {
          pullCards(0);
        }
      }
      else {
        print("you won!!!")
        usedDeck = [];
        win = true;
      }

      break;
  }

  console.log("Current deck length: " + currentDeck.length);
  console.log("Current sets length: " + currentSets.length);
}

function popCards() {
  
  cardIndexes = [];
  
  for (let i = 0; i < currentDeck.length; i++) {
    if (selectedSet.includes(allFrames[i].cardID)) {      // GET THE INDEX OF CORRECT CARDS
      cardIndexes.push(i);
    }
  }
  print(cardIndexes.length + " cards popped!")
  for (let i = cardIndexes.length - 1; i >= 0; i--) {     // SPLICE THE CORRECT CARDS FROM CURRENT DECK
    let usedCard = currentDeck.splice(cardIndexes[i], 1)[0];
    
    usedDeck.push(usedCard);
  }

  currentSets = findSets(currentDeck, allSets);

  if (currentSets.length === 0 || currentDeck.length == 9) {
    
    pullCards(1);
    print("pulled 3 more cards!")
  }
  else {
    setupFrames();
    print("adjusted deck to 12!")
  }

  selectedSet = [];
}

function setupFrames() {

  allFrames = [];

  for (let i = 0; i < currentDeck.length; i++) {      //CREATE CARD FRAMES FOR THE CURRENT DECK

    let x = Math.floor(i / 3);
    let y = i % 3;
    let frameSize = 3;
    let startX;
    let startY = 90;

    if (currentDeck.length > 12) {
      startX = 133;
    }
    else {
      startX = 209;
    }
    

    let newFrame = new FRAME(
      startX + (w * frameSize + margin * frameSize) * x,
      startY + (h * frameSize + margin * frameSize) * y,
      frameSize,
      0,
      currentDeck[i].cardID)

    allFrames.push(newFrame);
  }
}

function setupInterface() {

  let hSection = height / 8;  
  let wSection = width / 8;

  let bL = [1, 2, 3, 4, 5, 6, 12, 13, 14]
  let nL = [1, 2, 3, 4, 5, 6, 12, 13]
  let aL = [2, 6]
  
  //   UI ALIGN            x,            y,                    size,  col, clck, scnID,   string,    interact

  let next = new UI(width - wSection * 1,height - hSection * 1,   2,   1,    1,   bL,   'NEXT',         15);
  let back = new UI(       wSection * 1, height - hSection * 1,   2,   1,    1,   nL,   'BACK',         16);
  let apply = new UI(width - wSection * 4,height- hSection * 1,   2,   1,    1,   aL,   'NEXT',         17);

  allUI.push(back, next, apply);

  let title = new UI(      width / 2,    hSection * 1,            8,   0,    0,   0,    '- SET -' ,     0);
  let play = new UI(       width / 2,    height - hSection * 3,   4,   1,    1,   0,    'PLAY',         1);
  let config = new UI(     width / 2,    height - hSection * 2,   4,   1,    1,   0,    'CONFIG',       2);
  let trophies = new UI(   width / 2,    height - hSection * 1,   4,   1,    1,   0,    'TROPHIES',     3);

  allUI.push(title, play, config, trophies);

  let solo = new UI(       width / 2,    height - hSection * 3,   4,   1,    1,   1,    'SOLO',         4);
  let multi = new UI(      width / 2,    height - hSection * 2,   4,   1,    1,   1,    'MULTI',        5);
  let settings = new UI(   width / 2,    height - hSection * 1,   4,   1,    1,   1,    'SETTINGS',     6);

  allUI.push(solo, multi, settings);

  let theme = new UI(      width / 2,    height - hSection * 4,   4,   1,    1,   2,    'THEME',        0);
  let music = new UI(      width / 2,    height - hSection * 3,   4,   1,    1,   2,    'MUSIC',        0);
  let sound = new UI(      width / 2,    height - hSection * 2,   4,   1,    1,   2,    'SOUND',        0);
  let uisize = new UI(     width / 2,    height - hSection * 1,   4,   1,    1,   2,    'UI SIZE',      0);

  allUI.push(theme, music, sound, uisize);

  let stars = new UI(      width / 2,    height - hSection * 2.5, 4,   1,    1,   3,    'STARS',        12);
  let collection = new UI( width / 2,    height - hSection * 1.5, 4,   1,    1,   3,    'COLLECTION',   13);

  allUI.push(stars, collection);
  
  let gmsolo = new UI(     width / 2,    height - hSection * 6,   4,   1,    0,   4,    'GAMEMODE',     0);
  let classic = new UI(    width / 2,    height - hSection * 4,   4,   1,    1,   4,    'CLASSIC',     10);
  let arcade = new UI(     width / 2,    height - hSection * 3,   4,   1,    1,   4,    'ARCADE',      10);
  let srsolo = new UI(     width / 2,    height - hSection * 2,   4,   1,    1,   4,    'SPEEDRUN',    10);
  let ttsolo = new UI(     width / 2,    height - hSection * 1,   4,   1,    1,   4,    'TIME TRIAL',  10);
  
  allUI.push(gmsolo, classic, arcade, srsolo, ttsolo);
  
  let gmmult = new UI(     width / 2,    height - hSection * 6,   4,   1,    0,   5,    'GAMEMODE',     0);
  let party = new UI(      width / 2,    height - hSection * 4,   4,   1,    1,   5,    'PARTY',       10);
  let versus = new UI(     width / 2,    height - hSection * 3,   4,   1,    1,   5,    'VERSUS',      10);
  let srmult = new UI(     width / 2,    height - hSection * 2,   4,   1,    1,   5,    'SPEEDRUN',    10);
  let ttmult = new UI(     width / 2,    height - hSection * 1,   4,   1,    1,   5,    'TIME TRIAL',  10);
  
  allUI.push(gmmult, party, versus, srmult, ttmult);
  
  let players = new UI(    width / 2,    height - hSection * 2.5, 4,   1,    1,   6,     'PLAYERS',     0);
  let controls = new UI(   width / 2,    height - hSection * 1.5, 4,   1,    1,   6,     'CONTROLS',    0);
  
  allUI.push(players, controls);

  let local;
  let online;
  let limits;
  let sets;
  let time;
  let host;
  let join;
  let start;
  let pause;
  let set;
  let resume;
  let exit;

}