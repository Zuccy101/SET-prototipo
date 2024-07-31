let tile;
let tilesize = 8;
let bgScrollX;
let bgScrollY;
let scrollSpeed = -0.25;

function drawBackground() {

if (abs(bgScrollX) < tile.width * tilesize * 2){
    bgScrollX += (scrollSpeed / 10) * deltaTime;
  }
  else{
    bgScrollX = 0;
  }
  
  if (abs(bgScrollY) < tile.height * tilesize * 2){
    bgScrollY += (scrollSpeed / 10) * deltaTime;
  }
  else{
    bgScrollY = 0;
  }
  
  for (let x = 0; x < width / (tile.width * tilesize) + 8; x++){
    for (let y = 0; y < height / (tile.height * tilesize) + 8; y++){
      
      let scrollX = bgScrollX;
      let scrollY = bgScrollY;
      
      push();
      translate(-tile.width * tilesize * 4, -tile.height * tilesize * 4);
      if (x % 2 == 0){
        translate(width + tile.width * tilesize * 9, 0);
        scale(-1, 1);
        scrollX = -bgScrollX;
      }
      
      if (y % 2 == 0){
        translate(0, height  + tile.height * tilesize * 9);
        scale(1, -1);
        scrollY = -bgScrollY;
      }
      
      image(
        tile,
        x * tile.width * tilesize + scrollX,
        y * tile.height * tilesize + scrollY,
        tile.width * tilesize,
        tile.height * tilesize
      );
      pop();
    }
  }
}