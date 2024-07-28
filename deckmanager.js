let result = false;
let setFound = false;
let selectedSet = [];
let cardIndexes = [];
let timer = 0;

function manageCards() {

  for (let i = 0; i < currentDeck.length; i++) {
    currFrame = allFrames[i];

    drawCard(currFrame.x, currFrame.y, currFrame.size, currFrame.press, currentDeck[i]);
    
    if (checkHover(
      currFrame.x - margin * currFrame.size / 2,
      currFrame.y - margin * currFrame.size / 2,
      w * currFrame.size + margin * currFrame.size,
      h * currFrame.size + margin * currFrame.size,
      mouseX, mouseY)) {
      
      drawMarker(currFrame.x, currFrame.y, 63, 80, currFrame.size, mouseIsPressed);
      
      if (currFrame.press != 0 && !mouseIsPressed) {
        currFrame.press = 0;
      }

      if (![2, 3, 4].includes(currFrame.state)) {
        if (currFrame.state != 1) {
          currFrame.state = 1;
        }
        
        if (mouseIsPressed) {
          currFrame.press = 3;
          currFrame.state = 2;

          if (setFound){
            
            selectedSet = [];
            setFound = false;
            
            for (let frame of allFrames) {
              if (frame.cardID != currFrame.cardID){
                frame.state = 0;
              }
            }
          }
          if (!setFound){
            selectedSet.push(currFrame.cardID);
            
            if (selectedSet.length == 3) {
  
              let selectedFirst = deck[selectedSet[0] - 1]
              let selectedSecond = deck[selectedSet[1] - 1]
              let selectedLast = deck[selectedSet[2] - 1]
  
              //print(selectedFirst.shape + " " + selectedSecond.shape + " " + selectedLast.shape)

              result = validate(selectedFirst, selectedSecond, selectedLast);
              let setResult = result ? 4 : 3;

              setFound = true;

              for (setCardID of selectedSet) {
                for (frame of allFrames) {
                  if (frame.cardID == setCardID){
                    frame.state = setResult;
                  }
                }
              }
            }
          }
        }
      }
    }
    else {
      if (currFrame.press != 0) {
        currFrame.press = 0;
      }
      if (currFrame.state != 0 && ![2, 3, 4].includes(currFrame.state)){
        currFrame.state = 0;
      }
    }
  }
  if (setFound) {
    if (timer < 1500) {
      timer += deltaTime;
  
    } else {
      if (result) {
        popCards();
      }
      startupFrames();
      selectedSet = [];
      setFound = false;
      timer = 0;
    }
  }
}

function checkHover(x, y, w, h, mouseX, mouseY) {
  return ((mouseX > x && mouseX <= x + w) && (mouseY > y && mouseY <= y + h)) 
}
