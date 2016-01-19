// Set size of row and column for use in moving player
var tileX = 101;
var tileY = 83;
// Number of tile rows and columns
var rows = 3;
var cols = 5;
// An adjustment to make images lineup with background better
var shiftY = -10;
// Top and bottom Y values for player
var topY = -10;
var bottomY = (rows + 1) * tileY + shiftY;

/** Initial X location for player */
function playerInitialX() {
    return Math.floor(cols/2) * tileX;
}

/** Initial Y location for player */
function playerInitialY() {
    return bottomY;
}

/** Generate a random X location somewhere on road */
function randomX() {
    return Math.floor(Math.random() * cols) * tileX;
}

/** Generate a random Y location somewhere on road */
function randomY() {
    return Math.ceil(Math.random() * rows) * tileY + shiftY;
}

/** Generate a random integer between min and max values (inclusive)
 * @param {number} min - minimum integer value
 * @param {number} max - maximum integer value
 */
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Defines an enemy
 * @constructor
 */
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

/**
 * Update the enemy's position, required method for game
 * @param {number} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // If enemy has moved past right edge of canvas then reset
    // location and speed so enemy comes in from left again at a random time
    if(this.x > canvas.width) {
        this.x = randomX() * -1 - this.length;
        this.y = randomY();
        this.speed = Math.random() * gameinfo.levels[gameinfo.level][1] * 200 + 50;
    }

    this.x += this.speed*dt;
    // Check for collision. If collision, set player.collision to true
    if ( Math.abs(this.y - player.y) < 20 ) {
        if (( player.x >= this.x && player.x - this.x < this.length) ||
            ( this.x > player.x && this.x - player.x < this.length )) player.collision = true;
    }
};

/**
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Defines a player
 * @constructor
 */
var Player = function() {
    this.hero = 'images/char-cat-girl.png';
    this.x = playerInitialX();
    this.y = playerInitialY();
    this.collision = false;
    this.lostLife = false;
};

/**
 * Update location of player for collisions and out-of-bounds
 */
Player.prototype.update = function() {
    // In the event of a collision player goes back to start position
    // and one life is lost
    if (this.collision) {
        this.collision = false;
        this.lostLife = true;
        this.x = playerInitialX();
        this.y = playerInitialY();

    }
    // Keep the player within the boundaries of the game
    if (this.x < 0) this.x = 0;
    if (this.x > (cols - 1) * tileX) this.x = (cols - 1) * tileX;
    if (this.y < shiftY ) this.y = shiftY;
    if (this.y > (rows + 1) * tileY + shiftY) this.y = (rows + 1) * tileY + shiftY;
};

/**
 * Draw the player on the screen
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

/**
 * Handle keyboard input and update location of player
 * @param {keycode} key - keycode from event listener
 */
Player.prototype.handleInput = function(key) {
    if (key === "left") this.x += -tileX;
    if (key === "right") this.x += tileX;
    if (key === "up") this.y += -tileY;
    if (key === "down") this.y += tileY;
};

/**
 * Move player to start location
 */
Player.prototype.moveToInitialXY = function() {
    this.x = playerInitialX();
    this.y = playerInitialY();
};

/**
 * Keeps track of information about the game state
 * @constructor
 */
var Gameinfo = function() {
    // Initail game level
    this.level = 1;
    // Array with all levels.
    // First entry is a dummy to allow for easier indexing
    // Two values for each level - [# of enemies, speed multiplier]
    this.levels = [[0,0], [4, 1.0], [5, 1.5], [6, 2.0]];
    // Initial score
    this.score = 0;
    // Initial goal is to make it to the top
    this.goal = topY;
    // Initial number of lives
    this.lives = 3;
    // Number of times the road has to be crossed per level
    this.roadCrossings = 10;
    // Gem images
    this.gems = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png'];
    // Four flags to be used in controlling the game flow
    this.started = false;
    this.gameover = false;
    this.newLevel = false;
    this.pause = false;
    // Players for selection
    this.heros = ['images/char-boy.png',
                    'images/char-cat-girl.png',
                    'images/char-horn-girl.png',
                    'images/char-pink-girl.png',
                    'images/char-princess-girl.png'];
};

/**
 * Display all possible players ready for selection with selectPlayer()
 */
Gameinfo.prototype.displayPlayers = function() {
    ctx.textAlign = "center";
    ctx.font = "48pt Impact";
    ctx.fillStyle = "white";
    ctx.fillText("Select Player", canvas.width/2, 120);
    ctx.strokeText("Select Player", canvas.width/2, 120);
    var inc = 0;
    this.heros.forEach( function(hero) {
        ctx.drawImage(Resources.get(hero), inc++ * tileX, 4 * tileY + shiftY);
    });
};

/**
 * Select player
 * @param {event} e - from onmouseup event handler
 */
Gameinfo.prototype.selectPlayer = function(e) {
    if(!this.started) {
        // Translate window coordinates to canvas tile coordinates
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top - 50;
        // Check to see if mouse has been clicked on a player
        // If so, set this to our player and start game
        if(y>= 4 * tileY && y <= 5 * tileY) {
            player.hero = this.heros[Math.floor(x/tileX)];
            this.started = true;
        }
    }
};

/**
 * Update gameinfo - score, level, lives, roadCrossings, goal reached, gems array
 */
Gameinfo.prototype.update = function() {
    // Reached the goal?
    if (player.y === this.goal && !player.lostLife) {
        // Increase score
        this.score += 10;
        // Decrease number of crossings left to make
        this.roadCrossings += -1;
        // If the goal was the top make it the bottom and vice versa
        if (this.goal === topY) {
            this.goal = bottomY;
        } else {
            this.goal = topY;
        }
    }

    // If life has been lost then reset goal and reduce number of lives left
    if (player.lostLife) {
        this.goal = topY;
        this.lives--;
    }

    // If no lives left then it's Game Over!
    if (this.lives === 0) {
        this.gameover = true;
    }

    // If the required number of road crossings have been achieved
    // then advance to next level
    if (this.roadCrossings === 0) {
        // If no new levels left then game is complete - winner!
        if (++this.level >= this.levels.length) {
            this.gameover = true;
            this.level--;
        } else {
            // Reset for new level
            player.moveToInitialXY();
            this.roadCrossings = 10;
            this.lives++;
            this.newLevel = true;
            this.goal = topY;
            // Reset gems array to have a complete set
            this.gems = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png'];
            // Create a new gem
            gem = new Gem(this.gems.pop());
            // Add new enemies if the new level so dictates
            for ( var i = allEnemies.length; i < this.levels[this.level][0]; i++) {
                    allEnemies[i] = new Enemy();
            }
        }
    }
};

/**
 * Display gameinfo - score, level, lives, roadCrossings,
 * lost life, new level, game over
 */
Gameinfo.prototype.render = function() {
    // Test display properties
    if(this.gameover) {
        var message;
        if (this.lives === 0) {
            message = "GAME OVER!";
        } else {
            message = "WINNER!";
        }
        ctx.textAlign = "center";
        ctx.font = "48pt Impact";
        ctx.fillText(message, canvas.width/2, canvas.height/2);
        ctx.strokeText(message, canvas.width/2, canvas.height/2);
    }

    if(this.newLevel) {
        ctx.textAlign = "center";
        ctx.font = "48pt Impact";
        ctx.fillText("NEW LEVEL", canvas.width/2, canvas.height/2);
        ctx.strokeText("NEW LEVEL", canvas.width/2, canvas.height/2);
        setTimeout(function(){gameinfo.pause = false;}, 2000);
        this.pause = true;
        this.newLevel = false;
    }

    if(player.lostLife && !this.gameover) {
        ctx.textAlign = "center";
        ctx.font = "48pt Impact";
        ctx.fillText("BE CAREFUL!", canvas.width/2, canvas.height/2);
        ctx.strokeText("BE CAREFUL!", canvas.width/2, canvas.height/2);
        setTimeout(function(){gameinfo.pause = false;}, 2000);
        this.pause = true;
        player.lostLife = false;
    }

    ctx.font = "24pt Impact";
    ctx.textAlign = "left";
    ctx.lineWidth = 3;
    ctx.fillStyle = "white";
    var levelTxt = "LEVEL: " + (parseInt(this.level));
    ctx.fillText(levelTxt, 10, canvas.height-80);
    ctx.strokeText(levelTxt, 10, canvas.height-80);
    var xingsTxt = "CROSSINGS: " + (parseInt(10 - this.roadCrossings));
    ctx.fillText(xingsTxt, 10, canvas.height-30);
    ctx.strokeText(xingsTxt, 10, canvas.height-30);
    ctx.textAlign = "right";
    var livesTxt = "LIVES: " + (parseInt(this.lives));
    ctx.fillText(livesTxt, canvas.width -10, canvas.height-80);
    ctx.strokeText(livesTxt, canvas.width -10, canvas.height-80);
    var scoreTxt = "SCORE: " + parseInt(this.score);
    ctx.fillText(scoreTxt, canvas.width - 10, canvas.height-30);
    ctx.strokeText(scoreTxt, canvas.width - 10, canvas.height-30);

};

/**
 * Defines a gem
 * @constructor
 * @param {string} stone - image file for gem
 */
var Gem = function(stone) {
    this.stone = stone;
    // Display gem in a random location on the road
    this.x = randomX();
    this.y = randomY();
    // Start displaying gem between 5 and 20 seconds after it is created
    this.displayStart = randomInteger(5, 20);
    // Stop displaying gem between 2 and 10 seconds after it was initially displayed
    this.displayEnd = randomInteger(this.displayStart + 2, this.displayStart + 10);
    // Initial time equals zero
    this.t = 0;
    // Initial visibility is false
    this.visible = false;
};

/**
 * Updates visibility of gem based on the amount of time passed
 * since it was created. Updates gameinfo.score if player has
 * collected gem. Creates new gem if gem not collected.
 * @param {number} dt - delta time value
 */
Gem.prototype.update = function(dt) {
    // Add dt to obtain cumulative time since gem created
    this.t += dt;

    // Start displayin gem
    if( this.t > this.displayStart) this.visible = true;

    // Stop displaying gem and create new one if more available
    if( this.t > this.displayEnd) {
        this.visible = false;
        if (gameinfo.gems.length) gem = new Gem(gameinfo.gems.pop());
    }

    // Check to see if player has collected gem. If so, increase score
    if(this.visible) {
        if (this.x === player.x && this.y === player.y) {
            this.displayEnd = 0;
            gameinfo.score += 50;
        }
    }
};

/**
 * Display gem
 */
Gem.prototype.render = function() {
    if (this.visible) ctx.drawImage(Resources.get(this.stone), this.x, this.y);
};

// Instantiate game objects.

// Place the Gameinfo object in a variable called gameinfo
var gameinfo = new Gameinfo();

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < gameinfo.levels[gameinfo.level][0]; i++) {
    allEnemies[i] = new Enemy();
}

// Place the player object in a variable called player
var player = new Player();

// Instantiate the first gem object
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

