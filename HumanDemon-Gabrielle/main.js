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

function Hero(game, spritesheet) {
	this.animation = new Animation(spritesheet, 144, 145, 5, 0.1, 21, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
	
}

Hero.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Hero.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 21)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
}

function Demon(game, spritesheet) {
	this.animation = new Animation(spritesheet, 450, 355, 4, 0.15, 12, true, 0.3);
	this.speed = 200;
	this.ctx = game.ctx;
	Entity.call(this, game, 0, 270);
}

Demon.prototype = new Entity();
Demon.prototype.constructor = Demon;

Demon.prototype.update = function() {
	this.x += this.game.clockTick * this.speed;
	if (this.x > 800) this.x = -230;
	Entity.prototype.update.call(this);
}

Demon.prototype.draw = function() {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Demon1(game, spritesheet) {
	this.animation = new Animation(spritesheet, 450, 355, 4, 0.15, 4, true, 0.3);
	this.speed = 200;
	this.ctx = game.ctx;
	Entity.call(this, game, 0, 475);
}

Demon1.prototype = new Entity();
Demon1.prototype.constructor = Demon1;

Demon1.prototype.update = function() {
	this.x += this.game.clockTick * this.speed;
	if (this.x > 800) this.x = -230;
	Entity.prototype.update.call(this);
}

Demon1.prototype.draw = function() {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Knight(game, spritesheet) {
	this.animation = new Animation(spritesheet, 77, 111, 4, 0.15, 22, true, 1.2);
	this.speed = 100;
	this.ctx = game.ctx;
	Entity.call(this, game, 0, 150);
}

Knight.prototype = new Entity();
Knight.prototype.constructor = Knight;

Knight.prototype.update = function() {
	this.x += this.game.clockTick * this.speed;
	if (this.x > 800) this.x = -230;
	Entity.prototype.update.call(this);
}

Knight.prototype.draw = function() {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/hero2.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/demon.png");
AM.queueDownload("./img/knightFT.png");
AM.queueDownload("./img/demon1.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Hero(gameEngine, AM.getAsset("./img/hero2.png")));
    gameEngine.addEntity(new Demon(gameEngine, AM.getAsset("./img/demon.png")));
    gameEngine.addEntity(new Knight(gameEngine, AM.getAsset("./img/knightFT.png")));
    gameEngine.addEntity(new Demon1(gameEngine, AM.getAsset("./img/demon1.png")));

    console.log("All Done!");
});