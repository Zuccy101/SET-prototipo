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
let solveTimer = 1000

let win = false;
let sceneID = 0;
let margin = 2;
let cardID = 0;
let setID = 0;
let UIID = 0;

let cnv;

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

function setupInterface() {//x,          y,                    size,  col, clck, scnID,   string,    interact

  let hSection = height / 8;  
  let wSection = width / 8;

  let bL = [1, 2, 3, 4, 5, 6, 12, 13, 14]
  let nL = [-13, -26]
  let aL = [2, 6]
  let gL = [4, 14]
  let tL = [4, 14]
  let lL = [12, 13]

  let err = new UI(        width / 2,               height / 2,   8,   4,    1,   -1,   'ERROR' ,      -1);

  let back = new UI(       wSection * 1, height - hSection * 1,   2,   1,    1,   bL,   'BACK',         -2);
  let next = new UI(width - wSection * 1,height - hSection * 1,   2,   1,    1,   nL,   'NEXT',         -3);
  let apply = new UI(width -wSection * 1,height - hSection * 1,   2,   1,    1,   aL,   'APPLY',        0);

  let titleSet = new UI(   width / 2,    hSection * 1,            8,   0,    0,   0,    '_ SET _' ,     0);
  let play = new UI(       width / 2,    height - hSection * 3,   4,   1,    1,   0,    'PLAY',         1);
  let config = new UI(     width / 2,    height - hSection * 2,   4,   1,    1,   0,    'CONFIG',       2);
  let trophies = new UI(   width / 2,    height - hSection * 1,   4,   1,    1,   0,    'TROPHIES',     3);
  //PENDING CHANGES FOR ACHIEVEMENTS

  let titlePlay = new UI(  width / 2,    hSection * 1,            8,   0,    0,   1,    '_ PLAY _',     0);
  let solo = new UI(       width / 2,    height - hSection * 1.5, 4,   1,    1,   1,    'SOLO',         4);
  let multi = new UI(      width / 2,    height - hSection * 2.5, 4,   1,    1,   1,    'MULTI',        5);
  
  let titleConfig = new UI(width / 2,    hSection * 1,            8,   0,    0,   2,    '_ CONFIG _' ,  0);
  let sound = new UI(      width / 2,    height - hSection * 3,   4,   1,    1,   2,    'SOUND',        6);
  let uisize = new UI(     width / 2,    height - hSection * 2,   4,   1,    1,   2,    'UI SIZE',      7);
  let controls = new UI(   width / 2,    height - hSection * 1,   4,   1,    1,   2,    'CONTROLS',     8);

  let titleTrophies = new UI(width / 2,  hSection * 1,            8,   0,    0,   3,    '_ TROPHIES _', 0);
  let stars = new UI(      width / 2,    height - hSection * 2.5, 4,   1,    1,   3,    'STARS',        9);
  let collection = new UI( width / 2,    height - hSection * 1.5, 4,   1,    1,   3,    'COLLECTION',  10);
  
  let gamemode = new UI(  width / 2,     hSection * 1,            8,   0,    0,   gL,   '_ GAMEMODE _', 0);
  let arcade = new UI(    width / 2,     height - hSection * 3,   4,   1,    1,   4,    'ARCADE',      11);
  let timet = new UI(     width / 2,     height - hSection * 2,   4,   1,    1,   tL,   'TIME TRIAL',  12);
  let speed = new UI(     width / 2,     height - hSection * 1,   4,   1,    1,   4,    'SPEEDRUN',    13);
  let party = new UI(      width / 2,    height - hSection * 4,   4,   1,    1,   14,   'PARTY',       16);
  let versus = new UI(     width / 2,    height - hSection * 3,   4,   1,    1,   14,   'VERSUS',      16);
  
  let multiTitle = new UI( width / 2,    hSection * 1,            8,   0,    0,   5,    '_ MULTI _',    0);
  let local = new UI(      width / 2,    height - hSection * 2.5, 4,   1,    1,   5,    'LOCAL',       14);
  let online = new UI(     width / 2,    height - hSection * 1.5, 4,   1,    1,   5,    'ONLINE',      15);
  let host = new UI(       width / 2,    height - hSection * 2.5, 4,   1,    1,   15,   'HOST',        17);
  let join = new UI(       width / 2,    height - hSection * 1.5, 4,   1,    1,   15,   'JOIN',        18);
  
  let limitsTitle = new UI(width / 2,    hSection * 1,            8,   0,    0,   lL,    '_ LIMIT _',   0);
  let players = new UI(    width / 2,    height - hSection * 3  , 4,   1,    1,   19,   'PLAYERS',     20);
  let minigame = new UI(   width / 2,    height - hSection * 2  , 4,   1,    1,   11,   'MINIGAME',    20);
  let settings = new UI(   width / 2,    hSection * 1,            8,   0,    0,   16,   '_ SETTINGS _',20);

  let sets = new UI(       width / 2,    height - hSection * 3,    4,   1,    1,  12,   'SETS',        20);
  let time = new UI(       width / 2,    height - hSection * 3,    4,   1,    1,  13,   'TIME',        20);
  let start = new UI(      width / 2,    height - hSection * 1,    4,   1,    1,  20,   'START',       21);


  allUI.push(
    err, back, next, apply, 
    titleSet, play, config, trophies, 
    titlePlay, solo, multi, 
    titleConfig, sound, uisize, controls, 
    titleTrophies, stars, collection,
    gamemode, arcade, timet, speed, party, versus,
    multiTitle, local, online, host, join,
    limitsTitle, players, minigame, settings,
    sets, time, start
  );

  for (let i = 0; i < allUI.length; i++) {
    allUI[i].UIID = UIID;
    UIID ++;
  }

  let pause;
  let set;
  let resume;
  let exit;

}