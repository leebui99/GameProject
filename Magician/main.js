var AM = new AssetManager();

function Animation2(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop) {
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

Animation2.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, reflect) {
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

Animation2.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation2.prototype.isDone = function () {
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
function Magician(game, spritesheet) {
	//this.animation = new Animation(spritesheet, 64, 64, 4, 0.15, 16, true, false);
    this.animation = new Animation2(spritesheet, 0, 0, 64, 64, 4, 0.15, 16, true);
    this.upAnimation = new Animation2(spritesheet, 0, 256, 64, 64, 4, 0.15, 16, true);
    this.leftAnimation = new Animation2(spritesheet, 256, 0, 64, 64, 4, 0.15, 16, true);
    this.attackAnimation = new Animation2(spritesheet, 256, 256, 64, 64, 4, 0.15, 16, false);
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.space = false;
    this.move = false;
    this.radius = 100;
    this.ground = 350;
    this.xPosition = 350;
    this.yPosition = 350;
    Entity.call(this, game, 350, 350);//position where it start
}

Magician.prototype = new Entity();
Magician.prototype.constructor = Magician;

Magician.prototype.update = function () {
	//checking which key board is click
	if (this.game.w) {
		this.change("up");
		console.log("yes");
	}
	if (this.game.s) {
		this.change("down");
		console.log("yes");
	}
	if (this.game.a) {
		this.change("left");
		console.log("yes");
	}
	if (this.game.d) {
		this.change("right");
		console.log("yes");
	}
	if (this.game.space) {
		this.change("space");
		console.log("yes");
	}
	//move the character
    if (this.up) {
        if(this.move) {
	        this.yPosition -= 15;
	        if(this.yPosition <= 0) {
	        	this.yPosition = 0;
	        }
	        this.move = false;
        }
        this.y = this.yPosition;
    } else if(this.down) {
    	if(this.move) {
	        this.yPosition += 15;
	        if(this.yPosition >= 645) {
	        	this.yPosition = 645;
	        }
	        this.move = false;
        }
        this.y = this.yPosition;
    } else if(this.right) {
    	if(this.move) {
	        this.xPosition += 15;
	        if(this.xPosition >= 700) {
	        	this.xPosition = 700;
	        }
	        this.move = false;
        }
        this.x = this.xPosition;
    } else if(this.left) {
    	if(this.move) {
	        this.xPosition -= 15;
	        if(this.xPosition <= 0) {
	        	this.xPosition = 0;
	        }
	        this.move = false;
        }
        this.x = this.xPosition;
    } else if(this.space) {
    	if (this.attackAnimation.isDone()) {
            this.attackAnimation.elapsedTime = 0;
            this.space = false;
        }
    }
    
    Entity.prototype.update.call(this);
}

//a helper method for update on which dirction it should face.
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

Magician.prototype.draw = function (ctx) {
	//console.log(this.up);
	if (this.up) {
        this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.down) {
    	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.left) {
    	this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.right) {
    	this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, false, true);
    } else if(this.space) {
    	this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/magician.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Magician(gameEngine, AM.getAsset("./img/magician.png")));
    
    console.log("All Done!");
});
