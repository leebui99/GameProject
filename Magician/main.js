var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, reflect) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    //frame
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
    //console.log(xindex);
    //console.log(this.frameWidth);
    //console.log(this.startX);
    if(reflect) {
    	ctx.translate((x) * 2 + this.frameWidth,0);
    	ctx.scale(-1,1);
    }
    ctx.drawImage(this.spriteSheet,
    				// source from sheet
    			  xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  
                  this.frameWidth, this.frameHeight,
                  x, y,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
    
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
	//console.log(this.elapsedTime >= this.totalTime);
    return (this.elapsedTime >= this.totalTime);
}

//no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

//Magician
function Magician(game, spritesheet, spritesheet2) {
	//this.animation = new Animation(spritesheet, 64, 64, 4, 0.15, 16, true, false);
    this.animation = new Animation(spritesheet, 0, 0, 64, 64, 4, 0.15, 16, true);
    this.upAnimation = new Animation(spritesheet, 0, 256, 64, 64, 4, 0.15, 16, true);
    this.leftAnimation = new Animation(spritesheet, 256, 0, 64, 64, 4, 0.15, 16, true);
    this.rightAnimation = new Animation(spritesheet2, 0, 0, 64, 64, 4, 0.15, 16, true);
    this.attackAnimation = new Animation(spritesheet, 256, 256, 64, 64, 4, 0.15, 16, false);
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.space = false;
    this.move = false;
    this.radius = 100;
    this.ground = 350;
    this.xPosition = 400;
    this.yPosition = 350;
    Entity.call(this, game, 400, 350);//position where it start
}

Magician.prototype = new Entity();
Magician.prototype.constructor = Magician;

Magician.prototype.update = function () {
	//checking which key board is click
	if (this.game.click) {
		this.change(this.calDir(this.game.position.x, this.game.position.y));
		//console.log(temp);
		//this.change(temp);
	}
    
    Entity.prototype.update.call(this);
}

//a helper method for update on which direction it should face.
Magician.prototype.change = function(dir) {
	switch(dir) {
		case "up": this.up = true; this.down = false; this.left = false; this.right = false; this.space = false; break;
		case "down": this.up = false; this.down = true; this.left = false; this.right = false; this.space = false; break;
		case "left": this.up = false; this.down = false; this.left = true; this.right = false; this.space = false; break;
		case "right": this.up = false; this.down = false; this.left = false; this.right = true; this.space = false; break;
		case "space": this.up = false; this.down = false; this.left = false; this.right = false; this.space = true; break;
		default: console.log("none");
	}
	this.move = true;
}

//a helper method for update on which direction it should face.
Magician.prototype.calDir = function(x, y) {
	var nory = x*7/8;
	var oppy = x*-7/8 + 700;
	if(y <= nory && y <= oppy) {
		return "up";
	} else if(y >= nory && y <= oppy) {
		return "left";
	} else if(y <= nory && y >= oppy) {
		return "right";
	} else {
		return "down";
	}
}

Magician.prototype.draw = function (ctx) {
	//console.log(this.up);
	if (this.up) {
        this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.down) {
    	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.left) {
    	this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.right) {
    	this.rightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.space) {
    	this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

//spell
function Spell(game, spritesheet) {
    this.animation = new Animation(spritesheet, 2, 9, 63, 60, 8, 0.30, 8, true);
    this.oppAnimation = new Animation(spritesheet, 9, 252, 63, 60, 8, 0.30, 8, true);
    this.xOriginal = 400;
    this.yOriginal = 350;
    this.xPosition = 400;
    this.yPosition = 350;
    this.ctx = game.ctx;
    this.fire = false;
    Entity.call(this, game, 400, 350);//position where it start
}

Spell.prototype = new Entity();
Spell.prototype.constructor = Magician;

Spell.prototype.update = function () {
	if (this.game.click) {
		this.xPosition = this.game.position.x - (this.game.position.x % 10);
		this.yPosition = this.game.position.y - (this.game.position.y % 10);
		//console.log(this.yOriginal);
		this.xOriginal = 400;
	    this.yOriginal = 350;
		this.fire = true;
	}
	if(this.xOriginal < this.xPosition) {
		this.x = this.xOriginal;
		this.xOriginal += 5;
	}
	if(this.xOriginal > this.xPosition){
		this.x = this.xOriginal;
		this.xOriginal -= 5;
	} 
	if(this.yOriginal < this.yPosition) {
		this.y = this.yOriginal;
		this.yOriginal += 5;
	}
	if(this.yOriginal > this.yPosition){
		this.y = this.yOriginal;
		this.yOriginal -= 5;
	} 
	if(this.xOriginal == this.xPosition && this.yOriginal == this.yPosition) {
		this.fire = false;
		
	    
	}
	
    Entity.prototype.update.call(this);
}

Spell.prototype.draw = function () {
	if(this.fire) {
		if(this.xPosition < 400) {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else {
			this.oppAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
		
	}
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/magician.png");
AM.queueDownload("./img/magician2.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/fireball_0.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Magician(gameEngine, AM.getAsset("./img/magician.png"), 
    		AM.getAsset("./img/magician2.png")));
    gameEngine.addEntity(new Spell(gameEngine, AM.getAsset("./img/fireball_0.png")));
    
    console.log("All Done!");
});
