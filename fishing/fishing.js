window.onload = function () {
  const clickContainer = document.querySelector("#click-container");
  const fishingLine = document.querySelector("#line");
  const infoWrapper = document.querySelector("#info-wrapper");
  const instructions = document.querySelector("#instructions");
  const startBtn = document.querySelector("#start-btn");
  const gameStats = document.querySelector("#game-stats");
  const gameTimer = document.querySelector("#game-timer");
  const gameTimerGauge = document.querySelector(".timer-gauge");
  const gameScore = document.querySelector("#game-score");
  var mousePosition = {
    x: 0,
    y: 0,
  };
  var gameTimerInterval = null;
  var fishTracker = [0, 0]; //fish, bottle

  //initialise the create items interval variables
  var createFishInterval = null;
  var createBottleInterval = null;

  //music and sounds
  var bgm; //set bgm
  var bloop; //fish sound
  var bottleSound; // bottle sound

  //event listeners
  startBtn.addEventListener("click", startGame);
  clickContainer.addEventListener("mousemove", checkCursor);

  function checkCursor(event) {
    //update cursor coordinates
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    //set fishing line to follow cursor
    fishingLine.style.left = mousePosition.x + "px";
    fishingLine.style.top = mousePosition.y + "px";
  }

  //create audio element for playing music and sfx
  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    };
    this.stop = function () {
      this.sound.pause();
    };
  }

  //start game function
  function startGame() {
    //initialise sounds
    bloop = new sound("sounds/fish.mp3");
    bottleSound = new sound("sounds/glass.mp3");
    bgm = new sound("sounds/waves.mp3");
    bgm.play();
    infoWrapper.style.display = "none";
    clickContainer.style.display = "block";
    gameStats.style.display = "flex";
    createItems();
  }

  //create items function
  function createItems() {
    createTimer();
    createFishInterval = setInterval(createFish, 2500);
    createBottleInterval = setInterval(createBottle, 3000);
  }

  //create timer function
  function createTimer() {
    gameTimer.innerText = "15s";
    gameScore.innerText = "Fishes: 0 Bottles: 0";
    let sec = 0;
    gameTimerInterval = setInterval(startGameTimer, 1000);
    function startGameTimer() {
      gameTimer.textContent = 15 - sec + "s";
      if (sec === 15) {
        sec = 0;
        endGame(false);
        gameTimer.textContent = 15 - sec + "s";
        gameTimer.classList.remove("warning");
        gameTimerGauge.classList.remove("ticking");
      } else {
        if (sec === 1) {
          gameTimerGauge.classList.add("ticking");
        }
        if (sec > 9) {
          gameTimer.classList.add("warning");
        }
        sec++;
      }
    }
  }

  //create fish function
  function createFish() {
    let fish = document.createElement("div");
    fish.classList.add("item");
    fish.classList.add("fish");
    clickContainer.appendChild(fish);
    setPosition(fish);
    fish.addEventListener("mouseover", hit);
    setTimeout(function () {
      if (!fish.classList.contains("caught")) {
        fish.classList.add("disappear");
      }
      setTimeout(function () {
        if (clickContainer.contains(fish)) {
          clickContainer.removeChild(fish);
        }
      }, 4500);
    }, 4500);
  }

  //create bottle function
  function createBottle() {
    let bottle = document.createElement("div");
    bottle.classList.add("item");
    bottle.classList.add("bottle");
    clickContainer.appendChild(bottle);
    setPosition(bottle);
    bottle.addEventListener("mouseover", hit);
    setTimeout(function () {
      if (!bottle.classList.contains("caught")) {
        bottle.classList.add("disappear");
      }
      setTimeout(function () {
        if (clickContainer.contains(bottle)) {
          clickContainer.removeChild(bottle);
        }
      }, 4500);
    }, 4500);
  }

  function setPosition(item) {
    let leftPos = Math.floor(
      Math.random() * (clickContainer.offsetWidth - 100)
    );
    let topPos = Math.floor(
      Math.random() * ((clickContainer.offsetHeight / 5) * 4 - 100) +
        clickContainer.offsetHeight / 5
    );
    // if it a type of sea creature and is not bottle
    if (!item.classList.contains("bottle")) {
      let randomNum = Math.floor(Math.random() * 2);
      //left side
      if (randomNum % 2 === 0) {
        if (!item.classList.contains("jellyfish")) {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 4 - 100)
          );
        } else {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 2 - 100)
          );
        }
        setInterval(function () {
          if (item.classList.contains("fish")) {
            leftPos += 45;
          } else if (item.classList.contains("rare-fish")) {
            leftPos += 65;
          } else if (item.classList.contains("jellyfish")) {
            leftPos += 5;
          }
          item.style.left = leftPos + "px";
          item.style.top = topPos + "px";
        }, 100);
        item.classList.add("left");
      }
      //right side
      else {
        if (!item.classList.contains("jellyfish")) {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 4 - 100) +
              (clickContainer.offsetWidth / 4) * 3
          );
        } else {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 2 - 100) +
              clickContainer.offsetWidth / 2
          );
        }
        setInterval(function () {
          if (item.classList.contains("fish")) {
            leftPos -= 45;
          } else if (item.classList.contains("rare-fish")) {
            leftPos -= 65;
          } else if (item.classList.contains("jellyfish")) {
            leftPos -= 5;
          }
          item.style.left = leftPos + "px";
          item.style.top = topPos + "px";
        }, 100);
        item.classList.add("right");
      }
      item.style.left = leftPos + "px";
      item.style.top = topPos + "px";
    }
    //if it is bottle
    else {
      item.style.left = leftPos + "px";
      item.style.top = topPos + "px";
    }
  }

  function hit(event) {
    if (!fishingLine.classList.contains("zapped")) {
      let type = event.target.classList;
      if (!this.classList.contains("caught")) {
        this.classList.add("caught");
        if (type.contains("fish")) {
          bloop.play();
          fishTracker[0]++;
        } else if (type.contains("bottle")) {
          bottleSound.play();
          fishTracker[1]++;
        }
        gameScore.innerText = `Fishes: ${fishTracker[0]} Bottles: ${fishTracker[1]}`;
      }
    }
  }

  function endGame() {
    bgm.stop();
    clearInterval(gameTimerInterval);
    clearInterval(createFishInterval);
    clearInterval(createBottleInterval);
    let remainingItems = document.querySelectorAll(".item");
    for (var i = 0; i < remainingItems.length; i++) {
      clickContainer.removeChild(remainingItems[i]);
    }
    gameStats.style.display = "none";
    clickContainer.style.display = "none";
    startBtn.style.top = "66%";
    instructions.innerHTML = `<h2>You got a bottle</h2><a href="/">treasure!</a>`;
    infoWrapper.style.display = "block";
  }

  //Make bubbles
  var bubbles = document.getElementById("bubbles");
  var randomN = function (start, end) {
    return Math.random() * end + start;
  };
  var bubbleNumber = 0,
    generateBubble = function () {
      if (bubbleNumber < 20) {
        var bubble = document.createElement("div");
        var size = randomN(5, 10);
        bubble.setAttribute(
          "style",
          "width: " +
            size +
            "px; height: " +
            size +
            "px; left:" +
            randomN(1, bubbles.offsetWidth - (size + 4)) +
            "px;"
        );
        bubbles.appendChild(bubble);
        bubbleNumber++;
      } else {
        clearInterval(bubbleInterval);
      }
    };
  generateBubble();
  var bubbleInterval = setInterval(generateBubble, 500);

  instructions.innerHTML = `<p>Catch as many fishes as you can!</p><p>Don't worry about catching some bottles, there will be a fun surprise if you catch some...</p>`;
};
