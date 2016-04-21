var AM = new AssetManager();

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

//function MushroomDude(game, spritesheet) {
//this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
//this.x = 0;
//this.y = 0;
//this.speed = 100;
//this.game = game;
//this.ctx = game.ctx;
//}

//MushroomDude.prototype.draw = function () {
//this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//}

//MushroomDude.prototype.update = function () {
//if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
//this.x += this.game.clockTick * this.speed;
//if (this.x > 800) this.x = -230;
//}

function FlyingBird(game) {
    this.glideAnimation = new Animation(AM.getAsset("./img/Animal.png"), 240, 314, 2, 0.1, 1, true, 0.5);
    this.gliding = true;
    this.flyAnimation = new Animation(AM.getAsset("./img/Animal.png"), 240, 314, 1, 0.1, 4, false, 0.5);
    this.flying = false;
    this.explodeAnimation = new Animation(AM.getAsset("./img/explosion.png"), 64, 64, 0.05, 0.1, 23, false, 0.5);
    this.exploding = false;
    this.game = game;
    this.ctx = game.ctx;
    this.radius = 100; // what does this do...?
    this.ground = 400;

    this.x = 0;
    this.y = 600; // change to match ground level
}

FlyingBird.prototype.update = function() {
    if (this.game.theDKey) this.flying = true;
    if (this.game.theFKey) this.exploding = true;

    if (this.flying) {
        if (this.flyAnimation.isDone()) {
            this.flyAnimation.elapsedTime = 0;
            this.flying = false;
        }
        var flyDistance = this.flyAnimation.elapsedTime / this.flyAnimation.totalTime;
        var totalHeight = 200;

        if (flyDistance > 0.5) flyDistance = 1 - flyDistance;

        var height = totalHeight*(-4 * (flyDistance * flyDistance - flyDistance));
        this.y = this.ground - height;
        this.x += 2;
    } else if (this.exploding) { // exploding animation is stationary
        if (this.explodeAnimation.isDone()) {
            this.explodeAnimation.elapsedTime = 0;
            this.exploding = false;
        }
    }
};

FlyingBird.prototype.draw = function (ctx) { // TODO: only use ctx param if needed
    //console.log("x: " + this.x + " y: " + this.y);

    if (this.flying) {
        this.flyAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.exploding) {
        // magic numbers are to center explosion within body of flying bird image
        this.explodeAnimation.drawFrame(this.game.clockTick, this.ctx, this.x + 30, this.y + 25);
    } else { // this.gliding === true
        glideHelper(this.glideAnimation, this.game.clockTick, this.ctx, this.x, this.y);
    }
};

// TODO: could I handle implementing this functionality better? - ie. not using a helper...
var glideHelper = function(anim, tick, ctx, x, y) {
    anim.elapsedTime += tick;
    if (anim.isDone()) {
        if (anim.loop) anim.elapsedTime = 0;
    }

    ctx.drawImage(anim.spriteSheet,
        anim.frameWidth * 4, 0,  // source from sheet <-- hard coded coords for desired gliding frame
        anim.frameWidth, anim.frameHeight,
        x, y,
        anim.frameWidth,
        anim.frameHeight);
};

//inheritance 
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

//inheritance 
//function Guy(game, spritesheet) {
//this.animation = new Animation(spritesheet, 154, 215, 4, 0.15, 8, true, 0.5);
//this.speed = 100;
//this.ctx = game.ctx;
//Entity.call(this, game, 0, 450);
//}

//Guy.prototype = new Entity();
//Guy.prototype.constructor = Guy;

//Guy.prototype.update = function () {
//this.x += this.game.clockTick * this.speed;
//if (this.x > 800) this.x = -230;
//Entity.prototype.update.call(this);
//}

//Guy.prototype.draw = function () {
//this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//Entity.prototype.draw.call(this);
//}

//walk1
function Human1(game, spritesheet) {
	this.animation = new Animation(spritesheet, 250, 221, 200, 0.1, 10, true, 0.5);
	this.speed = 350;
	this.ctx = game.ctx;
	Entity.call(this, game, 0, 330);

//	this.explodeAnimation = new Animation(AM.getAsset("./img/explosion.png"), 64, 64, 5, 0.05, 23, false, 0.5);
//	this.exploding = false;
}

Human1.prototype = new Entity();
Human1.prototype.constructor = Human1;

Human1.prototype.update = function () {

	this.x += this.game.clockTick * this.speed;
	if (this.x > 800) this.x = -230;
	Entity.prototype.update.call(this);
}

Human1.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	Entity.prototype.draw.call(this);

}

//bird fly
function Bird(game, spritesheet) {
	this.animation = new Animation(spritesheet, 240, 314, 2, 0.1, 4, true, 0.5);
	this.speed = 350;
	this.ctx = game.ctx;
	Entity.call(this, game, 0, 50);
}

Bird.prototype = new Entity();
Bird.prototype.constructor = Bird;

Bird.prototype.update = function () {
	this.x += this.game.clockTick * this.speed;
	if (this.x > 800) this.x = -230;
	Entity.prototype.update.call(this);
}

Bird.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	Entity.prototype.draw.call(this);
}


//function Explosion(game) {
//    this.flyAnimation = new Animation(AM.getAsset("./img/explosion.png"), 64, 64, 0.05, 23, true);
//    this.x = 350;
//    this.y = 350;
//    this.game = game;
//    this.ctx = game.ctx;
//	Entity.call(this, game, 0, 50);
//
//    
//}
//
//Explosion.prototype.draw = function () {
//    this.flyAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//};
//
//Explosion.prototype.update = function() {}; // explosion doesn't move locations as it progresses


AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/Animal.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/walk1.png");
AM.queueDownload("./img/bgg.png");
AM.queueDownload("./img/explosion.png");

//Image necessary for title screen
AM.queueDownload("./img/title.png");
AM.queueDownload("./img/startgame.png");


AM.downloadAll(function () {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();
	gameEngine.init(ctx);
	gameEngine.start();

	gameEngine.addEntity(new FlyingBird(gameEngine));
	//gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bgg.png")));
	gameEngine.addEntity(new Bird(gameEngine, AM.getAsset("./img/Animal.png")));
	gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
	gameEngine.addEntity(new Human1(gameEngine, AM.getAsset("./img/walk1.png")));
	//gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));
	//gameEngine.addEntity(new Explosion(gameEngine, AM.getAsset("./img/explosion.png")));


	console.log("All Done!");
});

//Create scene
var makeSceneManager = function (gameEngine) {

    var titleScene = new Title(gameEngine);
    
    //not yet implement
    var tutorialScene = new Tutorial(gameEngine);
    var creditsScene = new Credits(gameEngine);
    //var eg = new StartGame(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/endgame-scene.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    
    titleScene.next = r1;
    titleScene.tutorialScene = tutorialScene;
    titleScene.creditsScene = creditsScene;
    tutorialScene.next = titleScene;
    creditsScene.next = titleScene;
    r1.next = sb1;
 

    return new SceneManager(gameEngine, logoSplash);
};

