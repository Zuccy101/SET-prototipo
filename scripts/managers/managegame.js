let selectedFrames = []; 
let selectedSecond = 0; 
let selectedFirst = 0; 
let selectedLast = 0; 
let selectedSet = []; 
let cardIndexes = []; 
let setFound = false; 
let result = false; 
let currSetFrame; 

let animationTimer = 0;

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

function checkHover(bounds) {
  return (
    (mouseX > bounds.x && mouseX <= bounds.x + bounds.w) && 
    (mouseY > bounds.y && mouseY <= bounds.y + bounds.h)
  ) 
}