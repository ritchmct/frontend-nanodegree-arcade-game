// Set size of row and column for use in moving player
var tileX = 101;
var tileY = 83;
// Number of tile rows and columns
var rows = 3;
var cols = 5;
// Test display properties
ctx.font = "24pt Impact";
ctx.textAlign = "left";
ctx.lineWidth = 3;
ctx.fillStyle = "white";



// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = Math.ceil(Math.random()*canvas.width*2)-canvas.width;
    this.y = Math.ceil(Math.random()*rows) * tileY - 20;
    this.speed = Math.random() * gameinfo.levels[gameinfo.level][1] * 200 + 50;
    // console.log(this.speed);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // console.log(canvas.width);

    if(this.x > canvas.width) {
        this.x = Math.ceil(Math.random()*canvas.width)-canvas.width;
        this.y = Math.ceil(Math.random()*rows) * tileY - 20;
    }
    this.x += this.speed*dt;
    // Check for collision
    if ( Math.abs(this.y - player.y) < 20 ) {
        if (( player.x >= this.x && player.x - this.x < 80) ||
            ( this.x > player.x && this.x - player.x < 80 )) player.collision = true;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Player = function() {
    this.hero = 'images/char-cat-girl.png';
    this.x = (cols%2 + 1) * tileX;
    this.y = (rows + 1) * tileY - 10;
    this.collision = false;
    this.lostLife = false;
};

// This class requires an update(),
Player.prototype.update = function(dt) {
    // In the event of a collision player goes back to start position
    // and one life is lost
    if (this.collision) {
        this.collision = false;
        this.lostLife = true;
        this.x = (cols%2 + 1) * tileX;
        this.y = (rows + 1) * tileY - 10;
    }
    // Keep the player within the boundaries of the game
    if (this.x < 0) this.x = 0;
    if (this.x > (cols - 1) * tileX) this.x = (cols - 1) * tileX;
    if (this.y < -10 ) this.y = -10;
    if (this.y > (rows + 1) * tileY - 10) this.y = (rows + 1) * tileY - 10;
};

// render()
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

// and a handleInput() method.
Player.prototype.handleInput = function(key) {
    if (key === "left") this.x += -tileX;
    if (key === "right") this.x += tileX;
    if (key === "up") this.y += -tileY;
    if (key === "down") this.y += tileY;
};

var Gameinfo = function() {
    this.level = 1;
    this.levels = [[0,0], [4, 1], [5, 1.2], [6, 1.7]];
    this.score = 0;
    this.goal = -10;
    this.lives = 3;
    this.roadCrossings = 10;
};

Gameinfo.prototype.update = function() {
    if (player.y === this.goal && !player.lostLife) {
        this.score += 10;
        this.roadCrossings += -1;
        // console.log("roadCrossings: ", this.roadCrossings);
        if (this.goal === -10) {
            this.goal = (rows + 1) * tileY - 10;
        } else {
            this.goal = -10;
        }
    }
    if (player.lostLife) {
        player.lostLife = false;
        this.goal = -10;
        this.lives += -1;
    }
    if (this.lives === 0) {
        this.level = 0;
    }
    if (this.roadCrossings === 0) {
        this.roadCrossings = 10;
        this.level += 1;
        this.lives += 1;
        if (this.level < this.levels.length) {
            for ( var i = allEnemies.length; i < this.levels[this.level][0]; i++) {
                allEnemies[i] = new Enemy;
            }
        }
    }
};

Gameinfo.prototype.render = function() {
    var levelTxt = "LEVEL: " + (parseInt(this.level));
    ctx.fillText(levelTxt, 10, canvas.height-30);
    ctx.strokeText(levelTxt, 10, canvas.height-30);
    var livesTxt = "LIVES: " + (parseInt(this.lives));
    ctx.fillText(livesTxt, 175, canvas.height-30);
    ctx.strokeText(livesTxt, 175, canvas.height-30);
    var scoreTxt = "SCORE: " + parseInt(this.score);
    ctx.fillText(scoreTxt, 350, canvas.height-30);
    ctx.strokeText(scoreTxt, 350, canvas.height-30);
    if (this.lives === 0 || this.level >= this.levels.length ) {
        if (this.lives === 0) {
            var gameOverTxt = "GAME OVER!";
        } else {
            var gameOverTxt = "WINNER!";
        }
        ctx.textAlign = "center";
        ctx.font = "48pt Impact";
        ctx.fillText(gameOverTxt, canvas.width/2, canvas.height/2);
        ctx.strokeText(gameOverTxt, canvas.width/2, canvas.height/2);
    }
};

// Now instantiate your objects.

var gameinfo = new Gameinfo;

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < gameinfo.levels[gameinfo.level][0]; i++) {
    allEnemies[i] = new Enemy;
}

// Place the player object in a variable called player
var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
