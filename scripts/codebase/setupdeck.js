
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

  if (currGamemode !== "TIME TRIAL") {
    for (let i = cardIndexes.length - 1; i >= 0; i--) {     // SPLICE THE CORRECT CARDS FROM CURRENT DECK
      let usedCard = currentDeck.splice(cardIndexes[i], 1)[0];
      
      usedDeck.push(usedCard);
    }
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