var ctx = document.getElementById('mainCanvas').getContext('2d');
var cte = document.getElementById('mainCanvas');
var sbe = document.getElementById('spriteBuffer');
var sbx = sbe.getContext('2d');
//calculating grid dimensions from canvas size; TODO: grid units as variable
var gridx = Math.floor(cte.width / 32);
var gridy = Math.floor(cte.height / 32);
//random start position for all tanks; should be removed
var startx = Math.round(Math.random() * gridx);
var starty = Math.round(Math.random() * gridy);
//your tank and 3 bots
var me, tank1, tank2, tank3;
var tankspr = new Image();
tankspr.src = 'img/tank1.png';
//just names in array
var names = ['Wilbur', 'Cordell', 'Terrell', 'Rich', 'Sol', 'Bertram', 'Luis', 'Ted', 'Elroy', 'Bernie'];
var tanksArr = [];
tankspr.onload = function() {
  sbx.drawImage(tankspr, 0, 0);
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
  me = new tank();
  me.initDraw();
  tanksArr.push(me);
  tank1 = new tank();
  tank1.moveRand();
  tanksArr.push(tank1);
  //tank2 = new tank();
  //tank2.moveRand();
  //tank3 = new tank();
  //tank3.moveRand();
};

var dirs = 'nesw';

function drawgrid() {
  for (var i = 0; i <= gridx; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 32, 0);
    ctx.lineTo(i * 32, cte.height);
    ctx.strokeStyle = '1px Black';
    ctx.stroke();
  };
  for (var i = 0; i <= gridy; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 32);
    ctx.lineTo(cte.width, i * 32);
    ctx.strokeStyle = 'Black';
    ctx.stroke();
  };
}
var tank = function() {
  this.randomness = Math.floor(Math.random() * 7 + 1);
  this.posx = startx * 32;
  this.posy = starty * 32;
  this.moving = false;
  this.bot = false;
  this.direction = dirs[Math.round(Math.random() * 3)];
  this.name = names[Math.round(Math.random() * names.length - 1)];
  this.speed = 4;
  this.initDraw = function() {
    ctx.drawImage(sbe, 0, 96, 32, 32, startx * 32, starty * 32, 32, 32);
  }
  this.moveRand = function() {
    var changeDir = Math.round(Math.random() * 2);
    var rndDirection = Math.round(Math.random() * this.randomness);
    var exclude = '';
    this.dirsEx = dirs;
    if (this.posy - 32 / 32 <= 0) {
      exclude = 'n';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    if ((this.posx + 32) / 32 >= gridx) {
      exclude = 'e';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    if (this.posx - 32 / 32 <= 0) {
      exclude = 'w';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude, '');
    }
    if ((this.posy + 32) / 32 >= gridy) {
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
        // Continue the loop in 3s
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
    if (direction == 'n') {
      dx = 0;
      dy = 0 - i;
      displacementX = 0;
      displacementY = -22;
    }
    if (direction == 's') {
      dx = 0;
      dy = 0 + i;
      displacementX = 0;
      displacementY = 22;
    }
    if (direction == 'e') {
      dx = 0 + i;
      dy = 0;
      displacementX = 22;
      displacementY = 0;
    }
    if (direction == 'w') {
      dx = 0 - i;
      dy = 0;
      displacementX = -22;
      displacementY = 0;
    }
    ctx.drawImage(sbe, 32, 64, 32, 32, oldX + displacementX, oldY + displacementY, 32, 32);
    ctx.drawImage(sbe, 32, 32, 32, 32, shootPointX + displacementX + dx, shootPointY + displacementY + dy, 32, 32);
    oldX = shootPointX + dx;
    oldY = shootPointY + dy;
    i = i + speed;
    if (Math.floor(oldX / 32) == Math.floor(me.posx / 32) && Math.floor(oldY / 32) == Math.floor(me.posy / 32) && tankObj.bot == true) {
      console.log('u ded');
      ctx.drawImage(sbe, 32, 64, 32, 32, shootPointX + displacementX + dx, shootPointY + displacementY + dy, 32, 32);
      oldX = -2;
      oldY = -2;
    }
    if (oldY > -1 && oldX > -1 && oldY < gridy * 32 && oldX < gridx * 32) {
      requestAnimationFrame(nextFrame);
    }

  }
  nextFrame();
}

function drawBrick(gridx, gridy) {}