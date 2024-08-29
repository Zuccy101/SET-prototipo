
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
