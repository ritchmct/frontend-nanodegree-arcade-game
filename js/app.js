// Set size of row and column for use in moving player
var tileX = 101;
var tileY = 83;
// Number of tile rows and columns
var rows = 3;
var cols = 5;


randomX = function() {
    return Math.floor(Math.random() * cols) * tileX;
};

randomY = function() {
    return Math.ceil(Math.random() * rows) * tileY - 10;
};

randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

playerSelect = function() {
    console.log("Player select");
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = randomX();
    this.y = randomY();
    this.length = 80;
    this.speed = Math.random() * gameinfo.levels[gameinfo.level][1] * 200 + 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // console.log(canvas.width);

    if(this.x > canvas.width) {
        this.x = randomX() * -1 - this.length;
        this.y = randomY();
    }
    this.x += this.speed*dt;
    // Check for collision
    if ( Math.abs(this.y - player.y) < 20 ) {
        if (( player.x >= this.x && player.x - this.x < this.length) ||
            ( this.x > player.x && this.x - player.x < this.length )) player.collision = true;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Player = function() {
    this.hero = 'images/char-cat-girl.png';
    this.x = (cols % 2 + 1) * tileX;
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
    this.gems = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png'];
    this.started = false;
    this.heros = ['images/char-boy.png',
                    'images/char-cat-girl.png',
                    'images/char-horn-girl.png',
                    'images/char-pink-girl.png',
                    'images/char-princess-girl.png'];
};

Gameinfo.prototype.init = function() {
    ctx.textAlign = "center";
    ctx.font = "48pt Impact";
    ctx.fillStyle = "white";
    ctx.fillText("Select Player", canvas.width/2, 120);
    ctx.strokeText("Select Player", canvas.width/2, 120);
    var inc = 0;
    this.heros.forEach( function(hero) {
        ctx.drawImage(Resources.get(hero), inc++ * tileX, 4 * tileY - 10);
    });
};

Gameinfo.prototype.playerSelect = function(e) {
    if(!this.started) {
        var rect = canvas.getBoundingClientRect();
        var x = e.x - rect.left;
        var y = e.y - rect.top - 60;
        if(y >= 4 * tileY -10 && y <= 5 * tileY - 10) {
            player.hero = this.heros[Math.floor(x/tileX)];
            this.started = true;
        }
    }
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
        this.gems = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png'];
        gem = new Gem(this.gems.pop());
        console.log(this.gems.length);
        if (this.level < this.levels.length) {
            for ( var i = allEnemies.length; i < this.levels[this.level][0]; i++) {
                allEnemies[i] = new Enemy;
            }
        }
    }
};

Gameinfo.prototype.render = function() {
    // Test display properties
    ctx.font = "24pt Impact";
    ctx.textAlign = "left";
    ctx.lineWidth = 3;
    ctx.fillStyle = "white";
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

var Gem = function(stone) {
    this.stone = stone;
    this.x = randomX();
    this.y = randomY();
    this.displayStart = randomInteger(5, 20);
    this.displayEnd = randomInteger(this.displayStart + 2, this.displayStart + 10);
    this.t = 0;
    this.visible = false;
};

Gem.prototype.update = function(dt) {
    // console.log(this.stone);
    this.t += dt;
    // console.log(this.displayStart, this.displayEnd, this.t);
    if( this.t > this.displayStart) this.visible = true;
    if( this.t > this.displayEnd) {
        this.visible = false;
        if (gameinfo.gems.length) gem = new Gem(gameinfo.gems.pop());
        console.log(gameinfo.gems.length);
    }
    if(this.visible) {
        if (this.x === player.x && this.y === player.y) {
            this.displayEnd = 0;
            gameinfo.score += 50;
        }
    }
};

Gem.prototype.render = function() {
    if (this.visible) ctx.drawImage(Resources.get(this.stone), this.x, this.y);
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

var gem = new Gem(gameinfo.gems.pop());


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

