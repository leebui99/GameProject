var AM = new AssetManager();
//sheetWidth is how many column is had to go through
//frame is total amount picture it had to go through for one animation
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Animation2(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, reverse) {
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
    this.reverse = reverse;
}

Animation2.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
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
    ctx.drawImage(this.spriteSheet,
    			  xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  // source from sheet
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

// no inheritance
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

function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

MushroomDude.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

MushroomDude.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
}


// inheritance 
function Cheetah(game, spritesheet) {
    this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
    this.speed = 350;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 250);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Cheetah.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//Magician
function Magician(game, spritesheet) {
	//this.animation = new Animation(spritesheet, 64, 64, 4, 0.15, 16, true, false);
    this.animation = new Animation2(spritesheet, 0, 0, 64, 64, 4, 0.15, 16, true, false);
    this.upAnimation = new Animation2(spritesheet, 0, 256, 64, 64, 4, 0.15, 16, true, false);
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.move = false;
    //this.radius = 100;
    //this.ground = 350;
    this.xPosition = 350;
    this.yPosition = 350;
    Entity.call(this, game, 350, 350);//position where it start
}

Magician.prototype = new Entity();
Magician.prototype.constructor = Magician;

Magician.prototype.update = function () {
	if (this.game.w) {
		this.up = true;
		this.move = true;
		console.log("yes");
	}
	if (this.game.s) this.down = true;
    if (this.up) {
        //console.log(this.up);
        if(this.move) {
	        this.yPosition -= 15;
	        if(this.yPosition <= 0) {
	        	this.yPosition = 0;
	        }
	        this.move = false;
        }
        this.y = this.yPosition;
    } else if(this.down) {
    	if (this.upAnimation.isDone()) {
            this.upAnimation.elapsedTime = 0;
            this.down = false;
        }
        this.yPosition += 1;
        if(this.yPosition >= 700) {
        	this.yPosition = 700;
        }
        this.y = this.yPosition;
    } else if(this.right) {
    	
    } else if(this.left) {
    	
    }
    
    Entity.prototype.update.call(this);
}

Magician.prototype.draw = function (ctx) {
	//console.log(this.up);
	if (this.up) {
        this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if(this.down) {
    	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

//Tellah
function Tellah(game, spritesheet) {
    this.animation = new Animation(spritesheet, 49, 51, 4, 0.35, 4, true, 1);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 450);//position where it start
}

Tellah.prototype = new Entity();
Tellah.prototype.constructor = Magician;

Tellah.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Tellah.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//Red
function Red(game, spritesheet) {
    this.animation = new Animation(spritesheet, 95, 90, 7, 0.35, 7, true, 1);
    this.speed = 0;
    this.ctx = game.ctx;
    Entity.call(this, game, 350, 550);//position where it start
}

Red.prototype = new Entity();
Red.prototype.constructor = Magician;

Red.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Red.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/FF4_Tellah.png");
AM.queueDownload("./img/magician.png");
//AM.queueDownload("./img/sorlo super sheet.png");
AM.queueDownload("./img/rT3jW.png");
//AM.queueDownload("./img/Wizard.png");
//AM.queueDownload("./img/Dark Magician Girl.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    gameEngine.addEntity(new Magician(gameEngine, AM.getAsset("./img/magician.png")));
    gameEngine.addEntity(new Tellah(gameEngine, AM.getAsset("./img/FF4_Tellah.png")));
    gameEngine.addEntity(new Red(gameEngine, AM.getAsset("./img/rT3jW.png")));
    
    
    /*
    var img = AM.getAsset("./img/magician.png");

    ctx.drawImage(img,
                  0, 0,  // source from sheet
                  189, 230, // width and height of source
                  200, 200, // destination coordinates
                  95, 115); // destination width and height
*/
    console.log("All Done!");
});