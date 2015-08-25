'use strict';
var ctx = document.getElementById('mainCanvas').getContext('2d');
var cte = document.getElementById('mainCanvas');
var gridx = Math.floor(cte.width / 32);
var gridy = Math.floor(cte.height / 32);
var startx = Math.round(Math.random() * gridx);
var starty = Math.round(Math.random() * gridy);
var img = new Image();
var names = ['Wilbur', 'Cordell', 'Terrell', 'Rich', 'Sol', 'Bertram', 'Luis', 'Ted', 'Elroy', 'Bernie'];
img.onload = function() {
  //ctx.drawImage(img, 0, 96, 32, 32, startx * 32, starty * 32, 32, 32);
  drawgrid();
};
img.src = 'img/tank1.png';
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
  this.randomness = Math.floor(Math.random()*7+1);
  this.posx = startx * 32;
  this.posy = starty * 32;
  this.moving = false;
  this.bot = false;
  this.direction = dirs[Math.round(Math.random() * 3)];
  this.name = names[Math.round(Math.random() * names.length - 1)];
  this.initDraw = function() {
    ctx.drawImage(img, 0, 96, 32, 32, startx * 32, starty * 32, 32, 32);
  }
  this.moveRand = function() {
    var changeDir = Math.round(Math.random() * 2);
    var rndDirection = Math.round(Math.random() *this.randomness);
    var exclude = '';
    this.dirsEx = dirs;
    if(this.posy-32/32 <= 0) {
      exclude = 'n';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude,'');
    }
    if((this.posx+32)/32 >= gridx) {
      exclude = 'e';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude,'');
    }
    if(this.posx-32/32 <= 0) {
      exclude = 'w';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude,'');
    }
     if((this.posy+32)/32 >= gridy) {
      exclude = 's';
      changeDir = 0;
      this.dirsEx = this.dirsEx.replace(exclude,'');
    }
    var rndDirection = Math.floor(Math.random() *this.dirsEx.length);
    if (changeDir == 0) {
      this.direction = this.dirsEx[rndDirection];
      //console.log( (this.posx+32)/32);
    }
    moveTank(this);
    this.bot = true;
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
        //tank.posx = tank.posx+dx;
        //tank.posy = tank.posy + dy;
        //console.log(tankObj.posx, tankObj.posy);
        //drawgrid();

        ctx.fillStyle = "white";
        ctx.fillRect(oldX, oldY, 32, 32)
        ctx.drawImage(img, spriteposX, spriteposY, 32, 32, tankObj.posx + dx, tankObj.posy + dy, 32, 32);
        //ctx.font = "bold 12px Arial";
        //ctx.fillStyle = "white";
        //ctx.fillText(tankName, oldX + 6, oldY + 10);
        //ctx.font = "bold 10px Arial";
        //ctx.fillStyle = "black";
        //ctx.fillText(tankName, tankObj.posx + dx + 6, tankObj.posy + dy + 10);
        oldX = tankObj.posx + dx;
        oldY = tankObj.posy + dy;

        i++;
        // Continue the loop in 3s

        setTimeout(nextFrame, 10);


      } else {
        tankObj.moving = false;
        tankObj.posx = tankObj.posx + dx;
        tankObj.posy = tankObj.posy + dy;
        //console.log(tankObj.posx / 32, tankObj.posy / 32, tankObj.posx, tankObj.posy, dx, dy);
        if (tankObj.bot == true) {
          tankObj.moveRand();
        }

      }
    }
    // Start the loop
    setTimeout(nextFrame, 0);
  }
}
document.onkeydown = function(e) {
  if (tank.moving == false) {
    console.log('key down');
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 38:
        moveTank('n');
        break;
      case 40:
        moveTank('s');
        break;
      case 37:
        moveTank('w');
        break;
      case 39:
        moveTank('e');
        break;
    }
  }
}

//function randMove(tankObj) {
//  var rndDirection = Math.round(Math.random() * 3)
//  var dirs = ['n', 'e', 's', 'w'];
//  moveTank(dirs[rndDirection], tankObj);
//  tankObj.bot = true;
//}

function tankShoot(tankObj) {

}
var tank1 = new tank();
tank1.moveRand();
var tank2 = new tank();
tank2.moveRand();
var tank3 = new tank();
tank3.moveRand();