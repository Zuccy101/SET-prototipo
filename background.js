let tile;
let size = 8;
let bgScrollX;
let bgScrollY;
let scrollSpeed = -0.5;

function drawBackground() {

if (abs(bgScrollX) < tile.width * size * 2){
    bgScrollX += scrollSpeed;
  }
  else{
    bgScrollX = 0;
  }
  
  if (abs(bgScrollY) < tile.height * size * 2){
    bgScrollY += scrollSpeed;
  }
  else{
    bgScrollY = 0;
  }
  
  for (let x = 0; x < width / (tile.width * size) + 8; x++){
    for (let y = 0; y < height / (tile.height * size) + 8; y++){
      
      let scrollX = bgScrollX;
      let scrollY = bgScrollY;
      
      push();
      translate(-tile.width * size * 4, -tile.height * size * 4);
      if (x % 2 == 0){
        translate(width + tile.width * size * 9, 0);
        scale(-1, 1);
        scrollX = -bgScrollX;
      }
      
      if (y % 2 == 0){
        translate(0, height  + tile.height * size * 9);
        scale(1, -1);
        scrollY = -bgScrollY;
      }
      
      image(
        tile,
        x * tile.width * size + scrollX,
        y * tile.height * size + scrollY,
        tile.width * size,
        tile.height * size
      );
      pop();
    }
  }
}