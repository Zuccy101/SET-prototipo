
class CARD {
  constructor(shape, amount, fill, col, cardID) {  //CARD CLASS
    this.shape = shape;
    this.amount = amount;
    this.fill = fill;
    this.col = col;

    this.cardID = cardID;
  }
}

class SET {
  constructor(first, second, last, setID) {  //SET CLASS
    this.first = first;
    this.second = second;
    this.last = last;

    this.setID = setID;
  }
}

class FRAME {
  constructor(x, y, size, state, cardID) {  //FRAME CLASS
    this.x = x;
    this.y = y;
    this.w = 49;
    this.h = 64;
    
    this.size = size;
    this.state = state;
    this.press = 0;
    
    this.cardID = cardID;
  }
}

class BOUNDARY {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

class UI {
  constructor(x, y, size, col, clickable, sceneID, string, interact) {
    this.x = x;
    this.y = y;
    this.UIID = 0;

    this.size = size;
    this.col = col;
    this.press = 0;

    this.clickable = clickable;
    this.interact = interact;
    this.sceneID = sceneID;
    this.string = string;

    this.editing = false;
    this.used = true;
  }

  addChar(key) {
    if (this.string.length < 8) {
      if (keyCode !== 8) {
        this.string += key;
        //console.log(this.string)
      }
    }
  }

  deleteChar() {
    this.string = this.string.slice(0, -1)
    console.log(this.string)
  }

  updateProperty(prop, value) {
    switch(prop) {
      case "col":
        this.col = value;
        break;

      case "clickable":
        this.clickable = value;
        break;

      case "string":
        this.string = value;
        break;

      case "editing":
        this.editing = value;
        break;

      default:
        console.log("Invalid property?: " + prop)
        console.log("Invalid value?: " + value)
        break;
    }
  }
}

class ANIMATION {
  constructor(targets, startX, startY, startS, endX, endY, endS, duration, type) {
    this.targets = targets;
    this.startX = startX;
    this.startY = startY;
    this.startS = startS;
    this.endX = endX;
    this.endY = endY;
    this.endS = endS;
    this.duration = duration;
    this.startTime = millis();
    this.type = type;
  }

  play() {
    let elapsedTime = millis() - this.startTime;
    let progress = min(elapsedTime / this.duration, 1);
    progress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    if (this.type === 'move-to-side') {

      this.targets.forEach((frame, index) => {
        frame.x = lerp(this.startX[index], this.endX[index], progress);
        frame.y = lerp(this.startY[index], this.endY[index], progress);
        frame.size = lerp(this.startS, this.endS, progress);
      });
    } else if (this.type === 'push-down') {
      this.targets.forEach((frame, index) => {
        frame.x = lerp(this.startX, this.endX, progress);
        frame.y = lerp(this.startY + index * (frame.h + 7), this.endY + index * (frame.h + 7), progress);
        frame.size = lerp(this.startS, this.endS, progress);
      });
    }
    else if (this.type === 'hover' || this.type === 'unhover') {
      this.targets.forEach((frame, index) => {
        frame.x = lerp(this.startX[index], this.endX[index], progress);
        frame.y = lerp(this.startY[index], this.endY[index], progress);
        frame.size = lerp(this.startS[index], this.endS[index], progress);
      });
    }
  }

  done() {
    return millis() - this.startTime >= this.duration;
  }
}

class STACK {
  constructor(f1, f2, f3, playerID) {
    this.frames = [f1, f2, f3];
    this.saved = false;
    this.playerID = playerID;
    this.animations = [];
    this.hover = false;
    
    this.collapsedPositions = this.frames.map((frame, index) => ({ x: frame.x, y: frame.y }));
    this.expandedPositions = this.frames.map((frame, index) => ({
      x: frame.x + index * (frame.w - frame.w / 3), // Expand by 2/3 of card width
      y: frame.y
    }));
  }

  update() {
    this.animations = this.animations.filter(anim => {
      
      anim.play();
      return (!anim.done());
      
    });
  }
  
  draw() {
    this.frames.forEach((frame, index) => {
      drawFrame(frame);
      drawCard(frame, deck[frame.cardID - 1]);
    });
  }
  
  animate(animation) {
    this.animations.push(animation);
    console.log(this.animations.length)
  }
}

class PLAYER {
  constructor(peer, id, name) {
    this.peer = peer;
    this.id = id,
    this.name = name;
    this.pts = 0
  }
}


class PACKAGE {
  constructor(type) {
    this.type = type;
    this.components = {};
  }

  addComponent(name, component) {

    console.log(name + ", " + component)
    this.components[name = component];
  }

  getComponent(name) {

    console.log(this.components[name])
    return this.components[name];
  }

  serialize() {
    return JSON.stringify({
      type: this.type,
      components: this.components,
    });
  }

  static deserialize(serializedData) {
    
    let data = JSON.parse(serializedData);
    console.log(data.type)
    let pckg = new PACKAGE(data.type);
    pckg.components = data.components;
    return pckg;
  }
}