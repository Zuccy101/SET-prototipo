let animationTimer = 0;
let selectedFrames = [];
let selectedSecond = 0;
let selectedFirst = 0;
let selectedLast = 0;
let selectedSet = [];
let cardIndexes = [];
let setFound = false;
let result = false;
let currSetFrame;
let drawCond;
let stackX = 24;
let stackY = 112;

function manageGame() {

  for (let i = 0; i < currentDeck.length; i++) {
    let currFrame = allFrames[i];

    if ([selectedFirst.cardID, selectedSecond.cardID, selectedLast.cardID].includes(currFrame.cardID) && result) {
      //print("correct!")
    }
    else {
      drawFrame(currFrame);
      drawCard(currFrame, currentDeck[i]);
    }
    
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
            selectedFrames.push(currFrame); 
            
            if (selectedSet.length == 3) {
  
              selectedFirst = deck[selectedSet[0] - 1]
              selectedSecond = deck[selectedSet[1] - 1]
              selectedLast = deck[selectedSet[2] - 1]

              result = validate(selectedFirst, selectedSecond, selectedLast);
              let setResult = result ? 4 : 3;

              if (result) {
                let newStack = new STACK(
                  selectedFrames[0], selectedFrames[1], selectedFrames[2], 0
                );
                
                obtainedSets.push(newStack);
                
                for (let i = 0; i < 3; i++) {
                  let startXs = [newStack.frames[0].x, newStack.frames[1].x, newStack.frames[2].x];
                  let startYs = [newStack.frames[0].y, newStack.frames[1].y, newStack.frames[2].y];
                  let endXs = [16, 16 + (newStack.frames[i].w / 2), 16 + 2 * (newStack.frames[i].w / 2)];
                  let endYs = [112, 112, 112];
                
                  let getAnim = new ANIMATION(
                    newStack.frames,
                    startXs, startYs,
                    newStack.frames[i].size, 
                    endXs, 
                    endYs, 
                    1, 
                    1500, 'move-to-side'
                  );
                
                  newStack.animate(getAnim);
                }
                
                for (let i = 0; i < obtainedSets.length - 1; i++) {
                  let currStack = obtainedSets[i];
                  for (let j = 0; j < 3; j++) {
                    let downAnim = new ANIMATION(
                      [currStack.frames[j]], 
                      currStack.frames[j].x, 
                      currStack.frames[j].y, 
                      currStack.frames[j].size, 
                      currStack.frames[j].x, 
                      currStack.frames[j].y + currStack.frames[j].h + 7, 
                      currStack.frames[j].size, 
                      1500, 'push-down'
                    );
                    currStack.animate(downAnim);
                  }
                }
              }

              setFound = true;

              for (setCardID of selectedSet) {
                for (let i = 0; i < allFrames.length; i++) {
                  if (allFrames[i].cardID == setCardID){
                    allFrames[i].state = setResult;
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
    if (animationTimer < 1500) {
      animationTimer += deltaTime;

    } else {
      if (result) {
        popCards();
      }
      selectedFrames = [];
      result = false;
      setupFrames();
      selectedSet = [];
      setFound = false;
      animationTimer = 0;
    }
  }
}

function drawCondition(value, UIID) {
  if (value) {
    return(
      (UIID.sceneID == sceneID)
    )
  }
  else {
    return(
      (UIID.sceneID.includes(sceneID))
    )
  }
}

function manageSets() {
  
  for (let currStack of obtainedSets) {
    currStack.draw();
    currStack.update();

    if (!setFound) {
      currStack.frames.forEach((frame, index) => {
        frame.state = 0;
      });
    }

    let stackBounds = new BOUNDARY(
      currStack.frames[0].x, currStack.frames[0].y, currStack.frames[0].w * 3, currStack.frames[0].h
    );

    if (checkHover(stackBounds)) {
      print("extended stack!")
    }
  }
}

function manageInterface() {

  for (let i = 0; i < allUI.length; i++) {

    if (![15, 16, 17].includes(allUI[i].interact)) {

      drawCond = drawCondition(true, allUI[i])
    }
    else {

      drawCond = drawCondition(false, allUI[i])
    }

    if (drawCond) {
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

      if (allUI[i].clickable == 1) {
        
        let currBounds = new BOUNDARY(
          allUI[i].x - (strw / 2),
          allUI[i].y - (h * allUI[i].size / 2),
          strw,
          h * allUI[i].size
        )
  
        if (checkHover(currBounds)) {
          
          drawSelect(currBounds, allUI[i].size, allUI[i].press);
  
          if (mouseIsPressed) {

            if (clickID != allUI[i].interact) {
              //print("clickID is " + clickID)
              clickID = allUI[i].interact;
            }

            //print("clickID is " + clickID)
            hoveredBounds = currBounds;

            if (allUI[i].press != 1) {

              allUI[i].press = 1;

              if (!clickedUI) {
                clickedUI = true;
              }
            }
          }
          else {
            if (allUI[i].press != 0) {
              allUI[i].press = 0;
            }
          }
          
        }
        else {
          
          if (clickID != 0 && clickedUI == false) {
            clickID = 0;
  
          }
          if (allUI[i].press != 0) {
            allUI[i].press = 0;
          }
        }
      }
    }
  }
}

function manageInteract() {
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
    case 15:
      sceneID ++;
      break;
    case 16:
      sceneID --;
      break;
    case 17:
      return;
      break;
  }
}

function manageInteraction(clickID) {
  if (clickID == 0) {
    print("nothing " + clickID);
    return;
  }
  
  if (![0, 15, 16, 17].includes(clickID)) {
    print("up a scene " + clickID);
    sceneID = clickID;

    print("sceneID updated to " + sceneID);
    return;
  }

  if (clickID == 15) {
    print("down a scene " + clickID);
    if ([1, 2, 3].includes(sceneID)) {
      sceneID = 0;
      return;
    }
    if ([4, 5, 6].includes(sceneID)) {
      sceneID = 1;
      return;
    }
    if ([7, 8, 9].includes(sceneID)) {
      sceneID = 2;
      return;
    }
  }
}

function mouseReleased() {
  if (clickedUI) {
    if (checkHover(hoveredBounds)) {
      print("changing scenes...")
      manageInteract()
    }
    clickedUI = false;
  }
}

function getStringCenter(str, size, margin) {
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (charData[char]) {
      if (i == str.length -1) {
        margin = 0;
      }
      width += charData[char].w * size + margin;
    }
  }
  return width;
}

function checkHover(bounds) {
  return (
    (mouseX > bounds.x && mouseX <= bounds.x + bounds.w) && 
    (mouseY > bounds.y && mouseY <= bounds.y + bounds.h)
  ) 
}