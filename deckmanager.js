let result = false;
let setFound = false;
let selectedSet = [];
let cardIndexes = [];
let timer = 0;

function manageGame() {

  for (let frame of allFrames) {
    drawFrame(frame);
  }

  for (let i = 0; i < currentDeck.length; i++) {
    currFrame = allFrames[i];

    drawCard(currFrame.x, currFrame.y, currFrame.size, currFrame.press, currentDeck[i]);
    
    let currBounds = new BOUNDARY(
      currFrame.x - margin * currFrame.size / 2,
      currFrame.y - margin * currFrame.size / 2,
      w * currFrame.size + margin * currFrame.size,
      h * currFrame.size + margin * currFrame.size
    )

    if (checkHover(currBounds)) {
      
      drawSelect(currBounds, currFrame.size, currFrame.press);

      if (currFrame.press != 0 && !mouseIsPressed) {
        currFrame.press = 0;
      }

      if (![2, 3, 4].includes(currFrame.state)) {
        if (currFrame.state != 1) {
          currFrame.state = 1;
        }
        
        if (mouseIsPressed) {
          currFrame.press = 1;
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
      setupFrames();
      selectedSet = [];
      setFound = false;
      timer = 0;
    }
  }
}

function manageInterface() {

  for (let i = 0; i < allUI.length; i++) {
    if (allUI[i].sceneID == sceneID) {
      let h = 14;
      let uiMargin = 1 * allUI[i].size;
      let strw = getStringCenter(allUI[i].string, allUI[i].size, uiMargin);

      drawUI(
        allUI[i].x, 
        allUI[i].y, 
        strw,
        h,
        uiMargin,
        allUI[i].size, 
        allUI[i].col, 
        allUI[i].press, 
        allUI[i].string
      );

      let currBounds = new BOUNDARY(
        allUI[i].x - (strw / 2),
        allUI[i].y - (h * allUI[i].size / 2),
        strw,
        h * allUI[i].size
      )


      if (checkHover(currBounds)) {
          
        drawSelect(currBounds, allUI[i].size, allUI[i].press);

          if (mouseIsPressed) {
            clickID = allUI[i].interact;
            hoveredBounds = currBounds;
            if (allUI[i].press == 0) {
              allUI[i].press = 1;
            }
          if (!clicked) {
            clicked = true;
          }
        }
        else {
          if (allUI[i].press != 0 && allUI[i].press == 1) {
            allUI[i].press = 0;
          }
        }
      }
      else {
        
        if (clickID != 0 && clicked == false) {
          clickID = 0;

        }
        if (allUI[i].press != 0) {
          allUI[i].press = 0;
        }
      }
    }
  }
}

function interactManager() {
  switch(clickID) {
    case 0:
      return
      break;
    case 1:
      sceneID = 1;
      break;
    case 2:
      sceneID = 2;
      break;
    case 3:
      sceneID = 3;
      break;
    case 4:
      sceneID = 4;
      break;
    case 5:
      sceneID = 5;
      break;
    case 6:
      sceneID = 6;
      break;
    case 7:
      sceneID = 7;
      break;
    case 8:
      sceneID = 8;
      break;
    case 9:
      sceneID = 9;
      break;
    case 10:
      sceneID = 10;
      break;
    case 11:
      sceneID = 11;
      break;
    case 12:
      sceneID = 12;
      break;
    case 13:
      sceneID = 13;
      break;
    case 14:
      sceneID = 14;
      break;
  }
}
