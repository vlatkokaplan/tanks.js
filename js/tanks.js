var cte = document.getElementById('mainCanvas');
var ctx = cte.getContext('2d');
var sbe = document.getElementById('spriteBuffer');
var sbx = sbe.getContext('2d');
//calculating grid dimensions from canvas size; TODO: grid units as variable
cte.width = window.innerWidth;
cte.height = window.innerHeight;
var gridx = Math.floor(cte.width / 32);
var gridy = Math.floor(cte.height / 32);
//random start position for all tanks; should be removed
var startx = Math.round(Math.random() * gridx);
var starty = Math.round(Math.random() * gridy);
//your tank and 3 bots
var me, tank1, tank2, tank3;
var bricksArr = [];
var spriteSources = {
  tankspr: "img/tank1.png",
  brickspr: "img/brick.png"
}
var loadedImages = {};
(function() {
  for (var src in spriteSources) {
    var imgCount = 0;
    loadedImages[src] = new Image();
    loadedImages[src].onload = function() {
      imgCount++;
      if (imgCount == Object.keys(spriteSources).length) {
        spritesLoaded();
      }
    }
    loadedImages[src].src = spriteSources[src];
  }
})();

var names = ['Wilbur', 'Cordell', 'Terrell', 'Rich', 'Sol', 'Bertram', 'Luis', 'Ted', 'Elroy', 'Bernie'];
var tanksArr = [];

function spritesLoaded() {
  sbx.drawImage(loadedImages.tankspr, 0, 0);
  sbx.fillStyle = "white";
  sbx.fillRect(32, 0, 32, 32)
  sbx.beginPath();
  sbx.fillStyle = 'black';
  sbx.arc(48, 48, 5, 0, 2 * Math.PI, false);
  sbx.fill();
  sbx.beginPath();
  sbx.fillStyle = 'white';
  sbx.arc(48, 80, 6, 0, 2 * Math.PI, false);
  sbx.fill();
  drawgrid();
};


var dirs = 'nesw';

function initTanks() {
  me = new tank();
  me.init();
  tank1 = new tank();
  tank1.bot = true;
  tank1.init();
  tank2 = new tank();
  tank2.bot = true;
  tank2.init();
  tank3 = new tank();
  tank3.bot = true;
  tank3.init();
  drawBricks();
}

function drawgrid() {
  for (var i = 0; i <= gridx; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 32, 0);
    ctx.lineTo(i * 32, cte.height);
    ctx.strokeStyle = '1px Black';
    //ctx.stroke();
    bricksArr[i] = [];
    for (var l = 0; l <= gridy; l++) {
      //ctx.drawImage(loadedImages.brickspr, i * 32, l * 32);
      bricksArr[i][l] = 1;
    }
  };
  for (var i = 0; i <= gridy; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 32);
    ctx.lineTo(cte.width, i * 32);
    ctx.strokeStyle = 'Black';
    //ctx.stroke();
    //ctx.drawImage(loadedImages.brickspr, 0, i * 32);
  };
  initTanks();
}

function drawBricks() {
  //ctx.clearRect(0, 0, cte.width, cte.height);
  for (var i = bricksArr.length - 1; i >= 0; i--) {
    for (var j = bricksArr[i].length - 1; j >= 0; j--) {
      if (bricksArr[i][j] == 1) {
        ctx.drawImage(loadedImages.brickspr, i * 32, j * 32);
      };
    };
  };
}
var tank = function() {
  this.randomness = Math.floor(Math.random() * 7 + 1);
  this.startx = Math.round(Math.random() * gridx);
  this.starty = Math.round(Math.random() * gridy);
  this.posx = this.startx * 32;
  this.posy = this.starty * 32;
  this.moving = false;
  this.bot = false;
  this.direction = dirs[Math.round(Math.random() * 3)];
  this.name = names[Math.round(Math.random() * names.length - 1)];
  this.speed = 4;
  this.init = function() {
    ctx.drawImage(sbe, 0, 96, 32, 32, this.startx * 32, this.starty * 32, 32, 32);
    tanksArr.push(this);
    bricksArr[this.startx][this.starty] = 0;
    bricksArr[this.startx + 1][this.starty + 1] = 0;
    bricksArr[this.startx - 1][this.starty - 1] = 0;
    bricksArr[this.startx][this.starty - 1] = 0;
    bricksArr[this.startx - 1][this.starty] = 0;
    bricksArr[this.startx][this.starty + 1] = 0;
    bricksArr[this.startx + 1][this.starty] = 0;
    bricksArr[this.startx + 1][this.starty - 1] = 0;
    bricksArr[this.startx - 1][this.starty + 1] = 0;
    bricksArr[0][0] = 0;
    if (this.bot == true) {
      this.moveRand();
    }
  }
  this.moveRand = function() {
    var changeDir = Math.round(Math.random() * 2);
    var rndDirection = Math.round(Math.random() * this.randomness);
    var exclude = '';
    this.dirsEx = dirs;
    if (this.posy - 32 / 32 <= 0 || bricksArr[((this.posx) / 32)][(this.posy - 32) / 32] == 1) {
      exclude = 'n';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    if ((this.posx + 32) / 32 >= gridx || bricksArr[((this.posx + 32) / 32)][this.posy / 32] == 1) {
      exclude = 'e';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    if (this.posx - 32 / 32 <= 0 || bricksArr[((this.posx - 32) / 32)][this.posy / 32] == 1) {
      exclude = 'w';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    if ((this.posy + 32) / 32 >= gridy || bricksArr[((this.posx) / 32)][(this.posy + 32) / 32] == 1) {
      exclude = 's';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    var rndDirection = Math.floor(Math.random() * this.dirsEx.length);
    if (changeDir == 0) {
      this.direction = this.dirsEx[rndDirection];
      //console.log( (this.posx+32)/32);
    }
    if (this.stop == false) {
      moveTank(this);
    }
    this.bot = true;
  }
  this.stop = false;
  this.shoot = function() {
    var randomFire = Math.round(Math.random() * 11);
    if (randomFire == 5)
      tankShoot(this, 6);
  }
}

function moveTank(tankObj, speed) {
  if (tankObj.moving == false) {
    var dx, dy;
    var i = 0;
    var spriteposX, spriteposY;
    var tankName;
    var oldX = tankObj.posx;
    var oldY = tankObj.posy;
    var direction = tankObj.direction;
    if (tankObj.bot == true) {
      tankName = tankObj.name + '[bot]';
    } else {
      tankName = tankObj.name;
    }

    function nextFrame() {
      if (i < 33) {
        tankObj.moving = true;
        if (direction == 'n') {
          dx = 0;
          dy = 0 - i;
          spriteposX = 0;
          spriteposY = 96;
        }
        if (direction == 's') {
          dx = 0;
          dy = 0 + i;
          spriteposX = 0;
          spriteposY = 0;
        }
        if (direction == 'e') {
          dx = 0 + i;
          dy = 0;
          spriteposX = 0;
          spriteposY = 64;
        }
        if (direction == 'w') {
          dx = 0 - i;
          dy = 0;
          spriteposX = 0;
          spriteposY = 32;
        }
        ctx.drawImage(sbe, 32, 0, 32, 32, oldX, oldY, 32, 32);
        ctx.drawImage(sbe, spriteposX, spriteposY, 32, 32, tankObj.posx + dx, tankObj.posy + dy, 32, 32);
        oldX = tankObj.posx + dx;
        oldY = tankObj.posy + dy;
        i = i + tankObj.speed;
        window.requestAnimationFrame(nextFrame);
      } else {
        tankObj.moving = false;
        tankObj.posx = tankObj.posx + dx;
        tankObj.posy = tankObj.posy + dy;
        if (tankObj.bot == true) {
          tankObj.moveRand();
          tankObj.shoot();
        }
      }
    }
    // Start the loop
    nextFrame();
  }
}
document.onkeydown = function(e) {
  if (me.moving == false) {
    switch (e.keyCode) {
      case 38:
        me.direction = 'n';
        moveTank(me);
        break;
      case 40:
        me.direction = 's';
        moveTank(me);
        break;
      case 37:
        me.direction = 'w';
        moveTank(me);
        break;
      case 39:
        me.direction = 'e';
        moveTank(me);
        break;
      case 32:
        tankShoot(me, 6);
    }
  }
}

function tankShoot(tankObj, speed) {
  var i = 0;
  var shootPointX = tankObj.posx;
  var shootPointY = tankObj.posy;
  var direction = tankObj.direction;
  var oldX = shootPointX;
  var oldY = shootPointY;
  var displacementX;
  var displacementY;

  function nextFrame() {
    switch(direction) {
      case 'n':
      dx = 0;
      dy = 0 - i;
      displacementX = 0;
      displacementY = -11;
      break;
      case 's':
      dx = 0;
      dy = 0 + i;
      displacementX = 0;
      displacementY = 11;
      break;
      case 'e':
      dx = 0 + i;
      dy = 0;
      displacementX = 11;
      displacementY = 0;
      break;
      case 'w':
      dx = 0 - i;
      dy = 0;
      displacementX = -11;
      displacementY = 0;
      break;
    }
    ctx.drawImage(sbe, 32, 64, 32, 32, oldX + displacementX, oldY + displacementY, 32, 32);
    ctx.drawImage(sbe, 32, 32, 32, 32, shootPointX + displacementX + dx, shootPointY + displacementY + dy, 32, 32);
    oldX = shootPointX + dx;
    oldY = shootPointY + dy;
    i = i + speed;
    if (bricksArr[Math.round(oldX / 32)][Math.round(oldY / 32)] == 1) {
      bricksArr[Math.round(oldX / 32)][Math.round(oldY / 32)] = 0;
      ctx.clearRect(Math.round(oldX / 32)*32, Math.round(oldY / 32)*32, 32, 32);
      
      ctx.drawImage(sbe, 32, 64, 32, 32, shootPointX + displacementX + dx, shootPointY + displacementY + dy, 32, 32);
      oldX = -2;
      oldY = -2;
    }
    if (oldY > -1 && oldX > -1 && oldY < gridy * 32 && oldX < gridx * 32) {
      setTimeout(nextFrame, 10);
    }

  }
  nextFrame();
}
