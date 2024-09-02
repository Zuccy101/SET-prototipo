let drawCond;

function manageInterface() {
  let selectUI = -1;
  let selectBounds;

  for (let i = 0; i < allUI.length; i++) {

    if (![1, 2, 3, 18, 20, 29, 40, 41].includes(allUI[i].UIID)) {
      //print(allUI[i].UIID)
      drawCond = drawUICondition(true, allUI[i])
    }
    else {
      //print(allUI[i].UIID)
      drawCond = drawUICondition(false, allUI[i])
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

function drawUICondition(value, currUI) {
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