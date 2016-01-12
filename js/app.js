// Set size of row and column for use in moving player
var tileX = 101;
var tileY = 83;
// Number of tile rows and columns
var rows = 3;
var cols = 5;
// Array of arrays for different levels of difficulty
// Values are [#of enemies, max speed factor]
var levels = [[4, 1], [5, 1.2], [6, 1.7]];
// Initial level is 0
var level = 1;
var collision = false;

// Display level
ctx.font = "36pt Impact";
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
    this.speed = Math.random() * levels[level][1] * 200 + 50;
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
            ( this.x > player.x && this.x - player.x < 80 )) collision = true;
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

};

// This class requires an update(),
Player.prototype.update = function(dt) {
    if (collision) {
        collision = false;
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
    var levelTxt = "LEVEL: " + (parseInt(level) + 1);
    ctx.fillText(levelTxt, 10, canvas.height-30);
    ctx.strokeText(levelTxt, 10, canvas.height-30);
};
// and a handleInput() method.
Player.prototype.handleInput = function(key) {
    if (key === "left") this.x += -tileX;
    if (key === "right") this.x += tileX;
    if (key === "up") this.y += -tileY;
    if (key === "down") this.y += tileY;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < levels[level][0]; i++) {
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
