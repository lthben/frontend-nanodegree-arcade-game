// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.row = getRandomInt(1, 3);
    this.speed = getRandomInt(50, 150);
    this.col = -1;
    this.x = this.col*101;
    this.y = this.row*83 - 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > canvasWidth) {
        this.x = -101;
        this.row = getRandomInt(1, 3);
        this.speed = getRandomInt(30, 170);
        this.y = this.row*83 - 20;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

    this.sprite = 'images/char-boy.png';

    this.row = 5;
    this.col = 2;
    this.x = this.col*101,
    this.y = this.row*83 - 20;

    this.isHit = false;
    this.hasCrossed= false;
}

Player.prototype.update = function(dt) {
    this.x = this.col*101,
    this.y = this.row*83 - 20;

    if (this.row == 0) {
        this.hasCrossed = true; //has crossed the road
    }

    if (this.isHit == true) {
        this.retreat();
    }

    if (this.hasCrossed == true) {
        if (myGame.whichGame == "keys" && myGame.myKey.isHit == false) {
            this.retreat();
        } else if (myGame.whichGame == "hearts") {
            if (myGame.heart_1.isHit == false || myGame.heart_2.isHit == false || myGame.heart_3.isHit == false) {
                this.retreat();
            }
        } else if (myGame.whichGame == "gems") {
            if (myGame.gem_1.isHit == false || myGame.gem_2.isHit == false || myGame.gem_3.isHit == false) {
                this.retreat();
            }
        }
    }

    this.retreat = function() {
        this.col = 2; //retreat to starting pos
        this.row = 5;
        this.isHit = false;
        this.hasCrossed = false;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(theKeyName) {

    switch(theKeyName) {
        case('left'):
        if (this.col > 0) {
            this.col--;
        }
        break;
        case('right'):
        if (this.col < 4) {
            this.col++;
        }
        break;
        case('up'):
        if (this.row > 0) {
            this.row--;
        }
        break;
        case('down'):
        if (this.row < 5) {
            this.row++;
        }
        break;
        case('enter'):
        if (myGameMode == gameModes.welcomeScreen) {
            myGameMode = gameModes.playerSelection;
        } else if (myGameMode == gameModes.GameOver) {
            myGameMode = gameModes.welcomeScreen;
            init_entities();
        }
        default:
        break;
    }
}

var Goodie = function() { //key, gem or heart

    this.sprite = '';

    this.row = 2;
    this.col = 2;
    this.x = this.col*101,
    this.y = this.row*83 - 20;

    this.isHit = false;
    this.lastTime = Date.now();
    this.canAppear = true; //used for the gems game because they appear in sequence
}

Goodie.prototype.update = function(dt) {
    this.x = this.col*101,
    this.y = this.row*83 - 20;

    if (myGame.whichGame == 'keys') {
        if (Date.now() - this.lastTime > 1000) { //moves the key every seconds
            this.row = getRandomInt(1, 3);
            this.col = getRandomInt(0, 4);
            this.lastTime = Date.now();
        }
    }
}

Goodie.prototype.render = function() {
    if (this.isHit == false && this.canAppear == true) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

var GameText = function() { //handles all screen text

    this.dropScreen_effect = function() {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; //translucent black background to make the text stand out
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    ctx.textAlign = "center";

    this.render = function() {

        switch(myGameMode) {

            case(gameModes.welcomeScreen):

            this.dropScreen_effect();

            ctx.font = "18pt sans-serif";
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.fillText("Udacity frontend nanodregree arcade game", canvasWidth/2, canvasHeight*0.2);

            ctx.font = "12pt sans-serif"
            ctx.fillText("Based on the classic game 'Frogger'", canvasWidth/2, canvasHeight*0.25);

            ctx.font = "10pt sans-serif"
            ctx.fillText("Navigate your character to cross the road safely by using the arrow keys",
                canvasWidth/2, canvasHeight*0.5)
            ctx.fillText("Avoid the insects!", canvasWidth/2, canvasHeight*0.55);

            ctx.font = "12pt sans-serif";
            ctx.fillText("Press ENTER to continue", canvasWidth/2, canvasHeight*0.9);

            break;

            case(gameModes.playerSelection):

                this.dropScreen_effect();

                ctx.font = "12pt sans-serif";
                ctx.fillStyle = 'white';
                ctx.fillText("Select your character using the arrow keys", canvasWidth/2, canvasHeight*0.2);

                ctx.font = "12pt sans-serif";
                ctx.fillText("Press ENTER to continue", canvasWidth/2, canvasHeight*0.9);

                ctx.font = "10pt sans-serif";
                if (charSelectorPosX == 0.1*canvasWidth) {
                    ctx.fillText(" \"The Peasant Boy\" - Collect the key before time runs out",
                        canvasWidth*0.5, canvasHeight*0.7);
                } else if (charSelectorPosX == 0.4*canvasWidth) {
                    ctx.fillText(" \"The Farm Girl\" - Collect all three hearts before time runs out",
                        canvasWidth*0.5, canvasHeight*0.7);
                } else if (charSelectorPosX == 0.7*canvasWidth) {
                    ctx.fillText(" \"The Princess\" - Collect all three gems in sequence before time runs out",
                        canvasWidth*0.5, canvasHeight*0.7);
                }

            break;

            case(gameModes.inGame):

                ctx.fillStyle = "orange";
                ctx.font = "12pt sans-serif";
                ctx.fillText("time left", canvasWidth/2, canvasHeight*0.115);

                ctx.font = "24pt sans-serif";
                ctx.fillText(myGame.timeLeftSeconds, canvasWidth/2 - 15, canvasHeight*0.16);
                ctx.font = "16pt sans-serif";
                ctx.fillText(myGame.timeLeftMillis, canvasWidth/2 + 15, canvasHeight*0.16);

                ctx.fillStyle = "white";
                ctx.font = "12pt sans-serif";

                switch(myGame.whichGame) {

                    case("hearts"):
                        ctx.fillText("Collect all three hearts and cross the road before time runs out",
                            canvasWidth/2, canvasHeight*0.95);
                    break;

                    case("gems"):
                        ctx.fillText("Collect all three gems in sequence and",
                            canvasWidth/2, canvasHeight*0.92);
                        ctx.fillText("cross the road before time runs out",
                            canvasWidth/2, canvasHeight*0.95);
                    break;

                    case("keys"):
                        ctx.fillText("Collect the key and cross the road before time runs out",
                            canvasWidth/2, canvasHeight*0.95);
                    break;

                    default:
                    break;
                }
            break;

            case(gameModes.GameOver):

                this.dropScreen_effect();

                ctx.fillStyle = "white";
                ctx.font = "20pt sans-serif";
                ctx.fillText("GAME OVER", canvasWidth/2, canvasHeight*0.2);

                ctx.font = "12pt sans-serif";
                if (myGame.timeLeftSeconds != 0) {
                    ctx.fillText("You finished the game in " + Number(20 - myGame.timeLeftSeconds) + " seconds and " +
                    Number(100 - myGame.timeLeftMillis) + " milliseconds", canvasWidth/2, canvasHeight*0.3 );
                }
                ctx.fillText("Your score is ", canvasWidth/2, canvasHeight*0.5);
                ctx.font = "28pt sans-serif";
                ctx.fillText(myGame.score, canvasWidth/2, canvasHeight*0.65);

                ctx.font = "12pt sans-serif";
                ctx.fillText("Press ENTER to play again", canvasWidth/2, canvasHeight*0.9);

            break;

            default:
            break;
        }
    }
}

var render_charactersForSelection = function() { //character selection screen

    ctx.drawImage(charSelectorImage, charSelectorPosX, canvasHeight*0.3);
    ctx.drawImage(charImage1, canvasWidth*0.1, canvasHeight*0.2);
    ctx.drawImage(charImage2, canvasWidth*0.4, canvasHeight*0.2);
    ctx.drawImage(charImage3, canvasWidth*0.7, canvasHeight*0.2);
}

var render_charSelector = function(theKeyName) { //handles the character selection

    switch(theKeyName) {
        case('left'):
            if (charSelectorPosX > canvasWidth*0.1) {
                charSelectorPosX -= canvasWidth*0.3;
            }
        break;
        case('right'):
            if (charSelectorPosX < canvasWidth*0.7) {
                charSelectorPosX += canvasWidth*0.3;
            }
        break;
        case('enter'):

            if (charSelectorPosX == 0.1*canvasWidth) {
                player.sprite = 'images/char-boy.png';
                myGame.whichGame = "keys";
            } else if (charSelectorPosX == 0.4*canvasWidth) {
                player.sprite = 'images/char-cat-girl.png';
                myGame.whichGame = "hearts";
            } else if (charSelectorPosX == 0.7*canvasWidth) {
                player.sprite = 'images/char-princess-girl.png';
                myGame.whichGame = "gems";
            }

            myGame.init();
            myGameMode = gameModes.inGame;
            myGame.gameStartTime = Date.now();
        break;
        default:
        break;
    }
}


var Game = function() {

    this.gameStartTime = 0; //to be set upon character selection
    this.whichGame = ""; //to be set upon character selection
    this.score = 0;
    this.timeLimit = 20000; //in milliseconds
    this.timeLeftSeconds = 0;
    this.timeLeftMillis = 0;
    this.isGameOver = false;

    ctx.font = "12pt sans-serif";

    this.init = function() {

        switch(this.whichGame) {
            case("keys"):
                this.myKey = new Goodie();
                this.myKey.sprite = 'images/Key.png';
                this.myKey.row = getRandomInt(1, 3);
                this.myKey.col = getRandomInt(0, 4);
                this.myKey.isHit = false;
            break;

            case("hearts"):
                this.heart_1 = new Goodie();
                this.heart_1.sprite = 'images/Heart.png';
                this.heart_1.row = 3;
                this.heart_1.col = getRandomInt(0, 4);
                this.heart_1.isHit = false;

                this.heart_2 = new Goodie();
                this.heart_2.sprite = 'images/Heart.png';
                this.heart_2.row = 2;
                this.heart_2.col = getRandomInt(0, 4);
                this.heart_2.isHit = false;

                this.heart_3 = new Goodie();
                this.heart_3.sprite = 'images/Heart.png';
                this.heart_3.row = 1;
                this.heart_3.col = getRandomInt(0, 4);
                this.heart_3.isHit = false;
            break;

            case("gems"):
                this.gem_1 = new Goodie();
                this.gem_1.sprite = 'images/Gem Orange.png';
                this.gem_1.row = getRandomInt(1, 3);
                this.gem_1.col = getRandomInt(0, 4);
                this.gem_1.isHit = false;

                this.gem_2 = new Goodie();
                this.gem_2.sprite = 'images/Gem Green.png';
                this.gem_2.row = getRandomInt(1, 3);
                this.gem_2.col = getRandomInt(0, 4);
                this.gem_2.isHit = false;
                this.gem_2.canAppear = false; //only appears after gem 1 is obtained by player

                this.gem_3 = new Goodie();
                this.gem_3.sprite = 'images/Gem Blue.png';
                this.gem_3.row = getRandomInt(1, 3);
                this.gem_3.col = getRandomInt(0, 4);
                this.gem_3.isHit = false;
                this.gem_3.canAppear = false;
            break;

            default:
            break;
        }
    }

    this.run_game = function() {
        this.run_timer();
        this.run_goodies();
        this.run_checkGameStatus();
        this.run_score();
    }

    this.run_checkGameStatus = function() {
        switch(this.whichGame) {
            case("keys"):
                if (this.myKey.isHit == true && player.hasCrossed == true) {
                    this.isGameOver = true;
                    myGameMode = gameModes.GameOver;
                }
            break;

            case("hearts"):
                if (this.heart_1.isHit == true && this.heart_2.isHit == true && this.heart_3.isHit == true && player.hasCrossed == true) {
                    this.isGameOver = true;
                    myGameMode = gameModes.GameOver;
                }
            break;

            case("gems"):
                if (this.gem_1.isHit == true && this.gem_2.isHit == true && this.gem_3.isHit == true && player.hasCrossed == true) {
                    this.isGameOver = true;
                    myGameMode = gameModes.GameOver;
                }
            break;

            default:
            break;
        }
    }

    this.run_timer = function() {

        if (this.isGameOver == false) {

            this.timeLeftSeconds = (this.timeLimit - 1000)/1000 - Math.floor( (Date.now() - this.gameStartTime) /1000 ) ;
            this.timeLeftMillis = (((this.timeLimit - 1000) - ( Date.now() - this.gameStartTime) ) / 1000 ) % 1;
            this.timeLeftMillis = Math.abs((this.timeLeftMillis*100).toFixed(0));

            if (this.timeLeftSeconds == 0) { //time runs out
                this.isGameOver = true;
                myGameMode = gameModes.GameOver;
            }
        }
    }

    this.run_score = function() {

        if (this.isGameOver == true) {
            if (this.timeLeftSeconds == 0) {
                this.score = 0;
            } else {
                this.score = this.timeLeftSeconds * 1000;
                this.score = Number(this.score) + Number(this.timeLeftMillis);
            }
        }
    }

    this.run_goodies = function() {

        switch(this.whichGame) {

            case("keys"):
                this.myKey.update();
                this.myKey.render();
            break;

            case("hearts"):
                this.heart_1.update();
                this.heart_1.render();
                this.heart_2.update();
                this.heart_2.render();
                this.heart_3.update();
                this.heart_3.render();
            break;

            case("gems"):
                if (this.gem_1.isHit == true) {
                    this.gem_2.canAppear = true; //gem 2 appears once gem 1 is obtained by player
                }
                if (this.gem_2.isHit == true) {
                    this.gem_3.canAppear = true;
                }
                this.gem_1.update();
                this.gem_1.render();
                this.gem_2.update();
                this.gem_2.render();
                this.gem_3.update();
                this.gem_3.render();
            break;

            default:
            break;
        }

    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies,
    player,
    enemyCount  = 6,
    charImage1, charImage2, charImage3, charSelectorImage,
    heartImage, blueGemImage, greenGemImage, orangeGemImage, keyImage,
    charSelectorPosX = canvasWidth*0.4,
    myGameText, myGame;

var init_entities = function() {

    allEnemies = [];

    for (var i = 0; i < enemyCount; i++) {
           allEnemies.push(new Enemy);
    }

    player = new Player();

    charImage1 = new Image();
    charImage1.src = 'images/char-boy.png';
    charImage2 = new Image();
    charImage2.src = 'images/char-cat-girl.png';
    charImage3 = new Image();
    charImage3.src = 'images/char-princess-girl.png';
    charSelectorImage = new Image();
    charSelectorImage.src = 'images/Selector.png';
    heartImage = new Image();
    heartImage.src = 'images/Heart.png';
    blueGemImage = new Image();
    blueGemImage.src = 'images/Gem Blue.png';
    greenGemImage = new Image();
    greenGemImage.src = 'images/Gem Green.png';
    orangeGemImage = new Image();
    orangeGemImage.src = 'images/Gem Orange.png';
    keyImage = new Image();
    keyImage.src = 'images/Key.png';

    myGameText = new GameText();
    myGame = new Game();
}

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var checkCollisions = function() {

    switch(myGameMode) {

        case(gameModes.inGame):
            for (var anEnemy in allEnemies) {
                if (allEnemies.hasOwnProperty(anEnemy)) {

                    if ( (Math.abs(allEnemies[anEnemy].x - player.x) < 50)
                        &&  (Math.abs(allEnemies[anEnemy].y - player.y) == 0) ) {

                        player.isHit = true;
                    }
                }
            }

            switch(myGame.whichGame) {
                case("keys"):
                    if ( myGame.myKey.row == player.row && myGame.myKey.col == player.col ) {
                        myGame.myKey.isHit = true;
                    }
                break;

                case("hearts"):
                    if ( myGame.heart_1.row == player.row && myGame.heart_1.col == player.col ) {
                        myGame.heart_1.isHit = true;
                    }
                    if ( myGame.heart_2.row == player.row && myGame.heart_2.col == player.col ) {
                        myGame.heart_2.isHit = true;
                    }
                    if ( myGame.heart_3.row == player.row && myGame.heart_3.col == player.col ) {
                        myGame.heart_3.isHit = true;
                    }
                break;

                case("gems"):
                    if ( myGame.gem_1.row == player.row && myGame.gem_1.col == player.col ) {
                        myGame.gem_1.isHit = true;
                    }
                    if ( myGame.gem_2.row == player.row && myGame.gem_2.canAppear == true && myGame.gem_2.col == player.col ) {
                        myGame.gem_2.isHit = true;
                    }
                    if ( myGame.gem_3.row == player.row && myGame.gem_3.canAppear == true && myGame.gem_3.col == player.col ) {
                        myGame.gem_3.isHit = true;
                    }
                default:
                break;
            }

        break;

        default:
        break;
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    if (myGameMode== gameModes.playerSelection) {
        render_charSelector(allowedKeys[e.keyCode]);
    } else  if (player != null) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
