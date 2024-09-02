let stackX = 24;
let stackY = 112;

function manageSets() { // PENDING REWORK OF HOVER
  
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