let gmStr = ["PARTY", "VERSUS", "TIME TRIAL"]
let gmset = 0;

let currUitoEdit

function manageInteractions(clckID) {
  switch(clckID) {
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
        
        case 14:
        case 15:
          sceneID = 5;
          break;

        case 18:
        case 19:
          sceneID = 15;
          break;

        case 16:
        case 17:
          sceneID = 14;
          break;

        default:
          console.log("invalid backtrace? " + sceneID + " " + clickID)
          sceneID = -1;
          break;
      }
      break;

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
    case 20:
      sceneID = clickID;
      break;

    case 18:
      allUI[47].editing = false;
      allUI[41].editing == false;
      if (!usernameEdited) {
        username = "PLAYER 2"
      }
      allUI[41].string = username
      sceneID = 18;
      break;

    case 19:
      allUI[41].editing == false;
      if (!usernameEdited) {
        username = "PLAYER 1"
      }
      allUI[41].string = username
      sceneID = 19;
      break;
      
    
    case 21:
      initializeHost();
      break;

    case 22:
      if (maxPlayers !== 4) {
        maxPlayers++;
      }
      else {
        maxPlayers = 2;
      }
      allUI[30].string = maxPlayers.toString();
      break;

    case 23:
      if (gmset !== 2) {
        gmset++;
      }
      else {
        gmset = 0;
      }
      allUI[38].string = gmStr[gmset];
      break;

    case 24:
      navigator.clipboard.writeText(hostPeer.id)
        .then(() => {
          console.log('ID copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy ID: ', err);
        });
      break;

    case 25:
      sceneID = 25; //ONLINE ROOM
      break;

    case 26:  //ON PEER.CONNECT SEND AND ADD 1 UNTIL ROOM IS FULL, THEN YOU CAN START
      if (roomFull) {
        manageInteractions(50)
      }
      break;

    case 27:

      allUI[47].editing = !allUI[47].editing;
      currUitoEdit = allUI[47]
      if (allUI[47].editing == true) {
        allUI[47].string = ""
      }
      else {
        allUI[47].string = "PASTE ID";
      }
      break;

    case 28:
      
      allUI[41].editing = !allUI[41].editing;
      currUitoEdit = allUI[41]
      if (allUI[41].editing == true) {
        allUI[41].string = ""
      }
      else {
        allUI[41].string = username;
      }
      break;

    case 50:
      sceneID = 50; //ACTUAL GAME START
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
      manageInteractions(clickID)
    }
    clickedUI = false;
  }
}