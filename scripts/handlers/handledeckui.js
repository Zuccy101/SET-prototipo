
function drawUI(x, y, strw, h, margin, size, col, press, string) {
  
  
  let xPos = x - strw / 2;
  let yPos = (y - h * size / 2) + (press * size)
  let yOffset = (col * h) + (press * h * 5);
  
  for (let i = 0; i < string.length; i++) {
    let char = string[i];
    if (charData[char]) {
      let { x: sx, w } = charData[char];
      image(
        alphabetSpriteSheet, 
        xPos, 
        yPos, 
        w * size, 
        h * size, 
        sx, 
        yOffset, 
        w, 
        h
      );
      
      xPos += w * size + margin;
    }
  }
}

function drawSelect(bounds, size, press) {

  let selectSize = size;
  let w = 11;
  let h = 12;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {

      image(
        spriteSelect,
        bounds.x - (w * selectSize) + (i * (bounds.w + spriteSelect.width * selectSize / 4)),
        bounds.y - (h * selectSize) + (j * (bounds.h + spriteSelect.height * selectSize / 2)),
        w * selectSize,
        h * selectSize,
        i * w + (spriteSelect.width / 2 * press),
        j * h,
        w,
        h
      )

      /*strokeWeight(5)
      rect(bounds.x, bounds.y, bounds.w, bounds.h)
      point(
        bounds.x - (w * selectSize) + (i * (bounds.w + spriteSelect.width * selectSize / 4)),
        bounds.y - (h * selectSize) + (j * (bounds.h + spriteSelect.height * selectSize / 2)),
      )*/
    }
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