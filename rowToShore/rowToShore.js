/* 
 * Rowing to shore (in the smaller boat)
 * Avoiding rocks and other obstacles
 * 
 * 1 point added for each successful move
 * 1 live deducted for collision with stone
 */

var score = 0;
var lives = 3;

var ship  = document.getElementById("ship");
var stone0 = document.getElementById("stone0");
var stone1 = document.getElementById("stone1");
var stone2 = document.getElementById("stone2");
var stone3 = document.getElementById("stone3");
var stone4 = document.getElementById("stone4");
var stone5 = document.getElementById("stone5");
var stone6 = document.getElementById("stone6");
var stone7 = document.getElementById("stone7");
var stone8 = document.getElementById("stone8");

var runStone0 = 1;
var runStone1 = 0;
var runStone2 = 0;
var runStone3 = 0;
var runStone4 = 0;
var runStone5 = 0;
var runStone6 = 0;
var runStone7 = 0;
var runStone8 = 0;

function buttonPressed() {
    // Check which stone to run
    if (runStone0 == 1) {
        stone0.style.left = (parseInt(stone0.style.left) - 100) + "px";
    } else if (runStone1 == 1) {
        stone1.style.left = (parseInt(stone1.style.left) - 100) + "px";
    } else if (runStone2 == 1) {
        stone2.style.left = (parseInt(stone2.style.left) - 100) + "px";
    } else if (runStone3 == 1) {
        stone3.style.left = (parseInt(stone3.style.left) - 100) + "px";
    } else if (runStone4 == 1) {
        stone4.style.left = (parseInt(stone4.style.left) - 100) + "px";
    } else if (runStone5 == 1) {
        stone5.style.left = (parseInt(stone5.style.left) - 100) + "px";
    } else if (runStone6 == 1) {
        stone6.style.left = (parseInt(stone6.style.left) - 100) + "px";
    } else if (runStone7 == 1) {
        stone7.style.left = (parseInt(stone7.style.left) - 100) + "px";
    } else if (runStone8 == 1) {
        stone8.style.left = (parseInt(stone8.style.left) - 100) + "px";
    }

    let shipTop = parseInt(window.getComputedStyle(ship).getPropertyValue("top"));
    let stone0Left = parseInt(window.getComputedStyle(stone0).getPropertyValue("left"));
    let stone1Left = parseInt(window.getComputedStyle(stone1).getPropertyValue("left"));
    let stone2Left = parseInt(window.getComputedStyle(stone2).getPropertyValue("left"));
    let stone3Left = parseInt(window.getComputedStyle(stone3).getPropertyValue("left"));
    let stone4Left = parseInt(window.getComputedStyle(stone4).getPropertyValue("left"));
    let stone5Left = parseInt(window.getComputedStyle(stone5).getPropertyValue("left"));
    let stone6Left = parseInt(window.getComputedStyle(stone6).getPropertyValue("left"));
    let stone7Left = parseInt(window.getComputedStyle(stone7).getPropertyValue("left"));
    let stone8Left = parseInt(window.getComputedStyle(stone8).getPropertyValue("left"));

    // Do now allow ship to exit box
    if (shipTop < 0) {
        ship.style.top = 0 + "px";
    } else if (shipTop > 580) {
        ship.style.top = 580 + "px";
    }
    
    // Check whether to deduct lives or add score
    if (runStone0 == 1 && shipTop <= 80 && stone0Left <= 60 && stone0Left >= -80) {
        lives--;
    } else if (runStone1 == 1 && shipTop >= 10 && shipTop <= 150 && stone1Left <= 60 && stone1Left >= -80) {
        lives--;
    } else if (runStone2 == 1 && shipTop >= 80 && shipTop <= 220 && stone2Left <= 60 && stone2Left >= -80) {
        lives--;
    } else if (runStone3 == 1 && shipTop >= 150 && shipTop <= 290 && stone3Left <= 60 && stone3Left >= -80) {
        lives--;
    } else if (runStone4 == 1 && shipTop >= 220 && shipTop <= 360 && stone4Left <= 60 && stone4Left >= -80) {
        lives--;
    } else if (runStone5 == 1 && shipTop >= 290 && shipTop <= 430 && stone5Left <= 60 && stone5Left >= -80) {
        lives--;
    } else if (runStone6 == 1 && shipTop >= 360 && shipTop <= 500 && stone6Left <= 60 && stone6Left >= -80) {
        lives--;
    } else if (runStone7 == 1 && shipTop >= 430 && shipTop <= 570 && stone7Left <= 60 && stone7Left >= -80) {
        lives--;
    } else if (runStone8 == 1 && shipTop >= 500 && stone8Left <= 60 && stone8Left >= -80) {
        lives--;
    } else {
        score++;
    }

    // Decide on stone to activate
    if (stone0Left < -80) {
        runStone0 = 0;
        runStone1 = 1;
    }

    if (stone1Left < -80) {
        runStone1 = 0;
        runStone2 = 1;
    }

    if (stone2Left < -80) {
        runStone2 = 0;
        runStone3 = 1;
    }

    if (stone3Left < -80) {
        runStone3 = 0;
        runStone4 = 1;
    }

    if (stone4Left < -80) {
        runStone4 = 0;
        runStone5 = 1;
    }

    if (stone5Left < -80) {
        runStone5 = 0;
        runStone6 = 1;
    }

    if (stone6Left < -80) {
        runStone6 = 0;
        runStone7 = 1;
    }

    if (stone7Left < -80) {
        runStone7 = 0;
        runStone8 = 1;
    }

    if (stone8Left < -80) {
        // win game
        alert("Congradulations!\nYou have managed to successfully avoided the stones and navigated to the island!\nScore: " + score + " Lives: " + lives);
    }

    if (lives < 1) {
        // end game
        alert("Game Over! Score: " + score + " Lives: " + lives);
    }
    
    // To display score and lives count in box
    document.getElementById("scoreSpan").innerHTML = score;
    document.getElementById("livesSpan").innerHTML = lives;
}

// If up button is pressed
function upPressed() {
    ship.style.top = (parseInt(ship.style.top) - 30) + "px";

    buttonPressed();
}

// If down button is pressed
function downPressed() {
    ship.style.top = (parseInt(ship.style.top) + 30) + "px";

    buttonPressed();
}

// If reset button is pressed
function reset() {
    lives = 3;
    score = 0;

    runStone0 = 1;
    runStone1 = 0;
    runStone2 = 0;
    runStone3 = 0;
    runStone4 = 0;
    runStone5 = 0;
    runStone6 = 0;
    runStone7 = 0;
    runStone8 = 0;

    document.getElementById("scoreSpan").innerHTML = score;
    document.getElementById("livesSpan").innerHTML = lives;

    ship.style.top = 270 + "px";
    stone0.style.top = 0 + "px";
    stone0.style.left = 920 + "px";
    stone1.style.top = 70 + "px";
    stone1.style.left = 920 + "px";
    stone2.style.top = 140 + "px";
    stone2.style.left = 920 + "px";
    stone3.style.top = 210 + "px";
    stone3.style.left = 920 + "px";
    stone4.style.top = 280 + "px";
    stone4.style.left = 920 + "px";
    stone5.style.top = 350 + "px";
    stone5.style.left = 920 + "px";
    stone6.style.top = 420 + "px";
    stone6.style.left = 920 + "px";
    stone7.style.top = 490 + "px";
    stone7.style.left = 920 + "px";
    stone8.style.top = 560 + "px";
    stone8.style.left = 920 + "px";
}

/*********************************************** ARCHIVE *************************************************************/
function checkLives() {
    if (lives < 1) {
        // end game
        alert("Game Over! Score: " + score + " Lives: " + lives);
    }
}

function checkPosition() {
    if (runStone0 == 1 && shipTop <= 80 && stone0Left <= 60 && stone0Left >= -80) {
        lives--;
    } else if (runStone1 == 1 && shipTop >= 10 && shipTop <= 150 && stone1Left <= 60 && stone1Left >= -80) {
        lives--;
    } else if (runStone2 == 1 && shipTop >= 80 && shipTop <= 220 && stone2Left <= 60 && stone2Left >= -80) {
        lives--;
    } else if (runStone3 == 1 && shipTop >= 150 && shipTop <= 290 && stone3Left <= 60 && stone3Left >= -80) {
        lives--;
    } else if (runStone4 == 1 && shipTop >= 220 && shipTop <= 360 && stone4Left <= 60 && stone4Left >= -80) {
        lives--;
    } else if (runStone5 == 1 && shipTop >= 290 && shipTop <= 430 && stone5Left <= 60 && stone5Left >= -80) {
        lives--;
    } else if (runStone6 == 1 && shipTop >= 360 && shipTop <= 500 && stone6Left <= 60 && stone6Left >= -80) {
        lives--;
    } else if (runStone7 == 1 && shipTop >= 430 && shipTop <= 570 && stone7Left <= 60 && stone7Left >= -80) {
        lives--;
    } else if (runStone8 == 1 && shipTop >= 500 && stone8Left <= 60 && stone8Left >= -80) {
        lives--;
    } else {
        score++;
    }

    checkLives();
    
    document.getElementById("scoreSpan").innerHTML = score;
    document.getElementById("livesSpan").innerHTML = lives;
}

function moveStone0() {
    stone0.style.left = (parseInt(stone0.style.left) - 100) + "px";
}

function moveStone1() {
    stone1.style.left = (parseInt(stone1.style.left) - 100) + "px";
}

function moveStone2() {
    stone2.style.left = (parseInt(stone2.style.left) - 100) + "px";
}

function moveStone3() {
    stone3.style.left = (parseInt(stone3.style.left) - 100) + "px";
}

function moveStone4() {
    stone4.style.left = (parseInt(stone4.style.left) - 100) + "px";
}

function moveStone5() {
    stone5.style.left = (parseInt(stone5.style.left) - 100) + "px";
}

function moveStone6() {
    stone6.style.left = (parseInt(stone6.style.left) - 100) + "px";
}

function moveStone7() {
    stone7.style.left = (parseInt(stone7.style.left) - 100) + "px";
}

function moveStone8() {
    stone8.style.left = (parseInt(stone8.style.left) - 100) + "px";
}

function moveStone() {
    if (runStone0 == 1) {
        moveStone0();
    } else if (runStone1 == 1) {
        moveStone1();
    } else if (runStone2 == 1) {
        moveStone2();
    } else if (runStone3 == 1) {
        moveStone3();
    } else if (runStone4 == 1) {
        moveStone4();
    } else if (runStone5 == 1) {
        moveStone5();
    } else if (runStone6 == 1) {
        moveStone6();
    } else if (runStone7 == 1) {
        moveStone7();
    } else if (runStone8 == 1) {
        moveStone8();
    } 

    checkPosition();
}

function activateStone() {
    if (stone0Left < -80) {
        runStone0 = 0;
        runStone1 = 1;
    }

    if (stone1Left < -80) {
        runStone1 = 0;
        runStone2 = 1;
    }

    if (stone2Left < -80) {
        runStone2 = 0;
        runStone3 = 1;
    }

    if (stone3Left < -80) {
        runStone3 = 0;
        runStone4 = 1;
    }

    if (stone4Left < -80) {
        runStone4 = 0;
        runStone5 = 1;
    }

    if (stone5Left < -80) {
        runStone5 = 0;
        runStone6 = 1;
    }

    if (stone6Left < -80) {
        runStone6 = 0;
        runStone7 = 1;
    }

    if (stone7Left < -80) {
        runStone7 = 0;
        runStone8 = 1;
    }

    if (stone8Left < -80) {
        runStone0 = 0;
        runStone1 = 1;
    }

    moveStone();
}