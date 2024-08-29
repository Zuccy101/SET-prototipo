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
                    solveTimer, 'move-to-side'
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
                      solveTimer, 'push-down'
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
    if (animationTimer < solveTimer) {
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

function drawCondition(value, currUI) {
  if (value) {
    //print(currUI)
    return(
      (currUI.sceneID == sceneID)
    )
  }
  else {
    //print(currUI)
    return(
      (currUI.sceneID.includes(sceneID))
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
      currStack.saved = true;
    }

    let stackBounds = new BOUNDARY(
      currStack.frames[0].x, currStack.frames[0].y, currStack.frames[0].w * 3, currStack.frames[0].h
    );
    if (currStack.saved) {
      if (checkHover(stackBounds)) {
        if (!currStack.hover) {
          let hoverAnim = new ANIMATION(
            currStack.frames,
            currStack.frames.map(f => f.x),
            currStack.frames.map(f => f.y),
            currStack.frames.map(f => f.size),
            currStack.frames.map((f, i) => f.x + i * 24), // Adjust x positions for hover
            currStack.frames.map(f => f.y),
            currStack.frames.map(f => f.size),
            solveTimer / 2, // Duration of hover animation
            'hover'
          );
          currStack.animate(hoverAnim);
          currStack.hover = true;
        }
      } else {
        if (currStack.hover) {

          let unhoverAnim = new ANIMATION(    // ADD FLAG FOR HOVER TO RETURN OK
            currStack.frames,
            currStack.frames.map(f => f.x),
            currStack.frames.map(f => f.y),
            currStack.frames.map(f => f.size),
            currStack.frames.map((f, i) => f.x - i * 24), // Return to original x positions
            currStack.frames.map(f => f.y),
            currStack.frames.map(f => f.size),
            solveTimer / 2, // Duration of unhover animation
            'unhover'
          );
          currStack.animate(unhoverAnim);
          currStack.hover = false;
        }
      }
    }
  }
}

function manageInterface() {
  let selectUI = -1;
  let selectBounds;

  for (let i = 0; i < allUI.length; i++) {

    if (![1, 2, 3, 18, 20, 29].includes(allUI[i].UIID)) {
      //print(allUI[i].UIID)
      drawCond = drawCondition(true, allUI[i])
    }
    else {
      //print(allUI[i].UIID)
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
          selectUI = i;
          selectBounds = currBounds;
  
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
  if (selectUI != -1) {
    drawSelect(selectBounds, allUI[selectUI].size, allUI[selectUI].press);
    selectUI = -1;
  }
}

function manageInteractions() {
  switch(clickID) {
    case -1:
      sceneID = 0;
      break;
    case 0:
      console.log("null interaction? " + sceneID + " " + clickID)
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:  
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
      sceneID = clickID;
      break;

    case -2:
      switch(sceneID) {
        case 1:
        case 2:
        case 3:
          sceneID = 0;
          console.log("back to scene 0")
          break;

        case 4:
        case 5:
        case 6:
          sceneID = 1;
          console.log("back to scene 1")
          break;

        case 7:
          sceneID = 2;
          console.log("back to scene 2")
          break;
          
        case 8:
        case 9:
          sceneID = 3;
          break;
        
        default:
          console.log("invalid backtrace? " + sceneID + " " + clickID)
          sceneID = -1;
          break;
      }
      break;

    case -3:
      switch(sceneID) {
        case 1:
        case 2:
        case 3:
          sceneID = 0;
           break;
 
         case 4:
         case 5:
         case 6:
           sceneID = 1;
           break;
 
         case 7:
           sceneID = 2;
           break;
           
         case 8:
         case 9:
           sceneID = 3;
           break;
         
         default:
           console.log("invalid forwardtrace? " + sceneID + " " + clickID)
           break;
       }
       break;

    default:
      console.log("invalid interaction? " + sceneID + " " + clickID)
      sceneID = -1;
      break;
  }
}

function mouseReleased() {
  if (clickedUI) {
    if (checkHover(hoveredBounds)) {
      print("changing scenes...")
      manageInteractions()
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