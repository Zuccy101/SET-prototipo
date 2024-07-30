let deck = [];
let allSets = [];
let usedDeck = [];
let allFrames = [];
let currentDeck = [];
let currentSets = [];

let sceneID = 0;
let cardID = 0;
let setID = 0;
let margin = 2;
let win = false;

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
  constructor(x, y, size, press, state, cardID) {  //FRAME CLASS
    this.x = x;
    this.y = y;
    this.press = press;
    this.size = size;
    this.state = state;
    this.cardID = cardID;
  }
}

class UI {
  constructor(x, y, w, h, size, press, state, sceneID ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.size = size;
    this.press = press;
    this.state = state;
    this.sceneID = sceneID
  }
}

function setup() {

  cnv = createCanvas(1024, 768);
  cnv.parent("canvasParent")

  //setupInterface();
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
    let size = 3;
    let startX;
    let startY = 90;

    if (currentDeck.length > 12) {
      startX = 133;
    }
    else {
      startX = 209;
    }
    

    let newFrame = new FRAME(
      startX + (w * size + margin * size) * x,
      startY + (h * size + margin * size) * y,
      size,
      0,
      0,
      currentDeck[i].cardID)

    allFrames.push(newFrame);
  }
}

function setupInterface() {

  let play = new UI()
  let config;
  let trophies;
  let back;
  let next;
  let apply;
  let solo;
  let multi;
  let settings;
  let music;
  let sound;
  let uisize;
  let resolution;
  let theme;
  let stars;
  let collection;
  let players;
  let controls;
  let gamemode;
  let local;
  let online;
  let classic;
  let arcade;
  let speedrun;
  let timetrial;
  let party;
  let versus;
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