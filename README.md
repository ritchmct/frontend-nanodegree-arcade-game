# Front-End Nanodegree Arcade Game
This is a simple JavaScript game based on the 1981 arcade game Frogger. The basic objective being to direct the player across the road while avoiding the moving traffic. This is a fork of the udacity/frontend-nanodegree-arcade-game. Udacity have provided all the resources for the basic game functionality.

## Access to game
The game will run in most browsers and can be accessed directly [here](http://ritchmct.github.io/frontend-nanodegree-arcade-game/)

OR

The files can be downloaded to a computer and the game started by opening the index.html file directly in a browser.

## How to play
The user is initially presented with a **Select Player** screen. Any of the displayed characters can be selected with a click of the mouse.

The game commences immediately a player is selected. The player can be moved using the up, down, left and right keys on the keyboard.

A successful **Crossing** occurs when the player moves from the grass to the water or from the water to the grass. The score increases by 10 points for every successful crossing. A life is lost if the player has a collision with a **bug**. Additional points can be obtained by collecting **gems**.

After 10 successful crossings a new **level** of the game will be reached.

## Known issues
* The **Princess** character is slightly taller than the others and the top of her crown gets drawn above the limit of the water and not erased when the player moves away.
* There is no way to start a new game other than reloading the page in the browser.
* The game will only work with a mouse and keyboard and therefore isn't suitable for playing on tablet or phone.
* Key presses continue to be registered when the game is paused (after a life is lost or a new level is reached) and the player will move unexpectedly when the game resumes.

## License
MIT

