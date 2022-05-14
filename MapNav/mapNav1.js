// Define constants
var KEYCODE_ENTER = 13;		//useful keycode
var KEYCODE_SPACE = 32;		//useful keycode
var KEYCODE_UP = 38;		//useful keycode
var KEYCODE_LEFT = 37;		//useful keycode
var KEYCODE_RIGHT = 39;		//useful keycode
var KEYCODE_DOWN = 40;			//useful keycode
var KEYCODE_W = 87;			//useful keycode
var KEYCODE_A = 65;			//useful keycode
var KEYCODE_D = 68;			//useful keycode
var KEYCODE_S = 83;			//useful keycode

// ----------------------------------------------

// Define variables
var shootHeld;			//is the user holding a shoot command
var lfHeld;				//is the user holding a turn left command
var rtHeld;				//is the user holding a turn right command
var fwdHeld;			//is the user holding a forward command
var dnHeld;

var stage;
var preload;


var player = {
    x: 0,
    y: 0,
    width: 30,
    height: 30
}; // The player character
var playerSprite


var messageField;		//Message display field
var scoreField;			//score Field


var loadingInterval = 0;


// ----------------------------------------------


var canvasSize = {
	height: "80%",
	width: "80%",
}

let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

console.log(viewportHeight)
console.log(viewportWidth)

// ----------------------------------------------

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
window.addEventListener('resize', reportWindowSize);
document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

// ----------------------------------------------

// Runs once the body element has loaded
function init() {

    // // check if the document sound plugins can be initialized successfully 
    // if (!createjs.Sound.initializeDefaultPlugins()) {
	// 	document.getElementById("error").style.display = "block";
	// 	document.getElementById("content").style.display = "none";
	// 	return;
	// }

    // // Disable on certain browsers
    // if (createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry) {
	// 	document.getElementById("mobile").style.display = "block";
	// 	document.getElementById("content").style.display = "none";
	// 	return;
	// }


    canvas = document.getElementById("mapCanvas");
	canvas.height = viewportHeight
	canvas.width = viewportWidth
	// canvas.style.height = canvasSize.height
	// canvas.style.width = canvasSize.width
	stage = new createjs.Stage(canvas);

	messageField = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = stage.width / 2;
	messageField.y = stage.height / 2;
	stage.addChild(messageField);
	stage.update(); 	//update the stage to show text


    // begin loading content (only sounds to load)
	var assetsPath = "sounds/";
	manifest = [
		// {id: "begin", src: "spawn.ogg"},
		// {id: "break", src: "break.ogg", data: 6},
		// {id: "death", src: "death.ogg"},
		// {id: "laser", src: "shot.ogg", data: 6},
		// {id: "music", src: "music.ogg"}
	];


    // preload = new createjs.LoadQueue(true, assetsPath);
    // preload.installPlugin(createjs.Sound);
    // preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed
	// preload.addEventListener("progress", updateLoading);
	// preload.loadManifest(manifest);


    // Easel JS example
    playerSprite = new createjs.Shape();
    playerSprite.graphics.beginFill("#198558").drawCircle(0, 0, player.width);
    playerSprite.x = player.x;
    playerSprite.y = player.y;
    stage.addChild(playerSprite);

    // Tween JS ref example
    var circle = new createjs.Shape();
    circle.graphics.beginFill("Crimson").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    createjs.Tween.get(circle, {loop: true})
        .to({x: 400}, 1000, createjs.Ease.getPowInOut(4))
        .to({alpha: 0, y: 75}, 500, createjs.Ease.getPowInOut(2))
        .to({alpha: 0, y: 125}, 100)
        .to({alpha: 1, y: 100}, 500, createjs.Ease.getPowInOut(2))
        .to({x: 100}, 800, createjs.Ease.getPowInOut(2));

    createjs.Ticker.framerate = 60; 
    createjs.Ticker.addEventListener("tick", handleTick);
}

function restart() {
    // clear the stage
    stage.removeAllChildren();

    // reset game variables


    // reset control variables
	shootHeld = lfHeld = rtHeld = fwdHeld = dnHeld = false;
    
    //ensure stage is blank and add the ship
	stage.clear();

    //start game timer
	if (!createjs.Ticker.hasEventListener("tick")) {
		createjs.Ticker.addEventListener("tick", handleTick);
	}

}

var i = 0;
function handleTick(event) {
    // console.log(playerSprite)
    
    if (lfHeld) {
        playerSprite.x = playerSprite.x - 5
		if (playerSprite.x < player.width ) {
			playerSprite.x = player.width
		}
    }

    if (rtHeld) {
        playerSprite.x = playerSprite.x + 5
		if (playerSprite.x > viewportWidth - player.width ) {
			playerSprite.x = viewportWidth - player.width 
		}
    }

    if (fwdHeld) {
        playerSprite.y = playerSprite.y - 5
		if (playerSprite.y < player.height ) {
			playerSprite.y = player.height 
		}
    }

    if (dnHeld) {
        playerSprite.y = playerSprite.y + 5
		if (playerSprite.y > viewportHeight - player.height ) {
			playerSprite.y = viewportHeight - player.height 
		}
    }

	console.log(playerSprite.y)

	stage.update();
}

// Loading screen update functions
function updateLoading() {
	messageField.text = "Loading " + (preload.progress * 100 | 0) + "%";
	stage.update();
}

function doneLoading(event) {
	clearInterval(loadingInterval);
	scoreField = new createjs.Text("0", "bold 18px Arial", "#FFFFFF");
	scoreField.textAlign = "right";
	scoreField.x = canvas.width - 20;
	scoreField.y = 20;
	scoreField.maxWidth = 1000;

	messageField.text = "Welcome: Click to play";

	// start the music
	createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});

	watchRestart();
}

function watchRestart() {
	//watch for clicks
	stage.addChild(messageField);
	stage.update(); 	//update the stage to show text
	canvas.onclick = handleClick;
}

function handleClick() {
	//prevent extra clicks and hide text
	canvas.onclick = null;
	stage.removeChild(messageField);

	// indicate the player is now on screen
	createjs.Sound.play("begin");

	restart();
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_SPACE:
			shootHeld = true;
			return false;
		case KEYCODE_A:
		case KEYCODE_LEFT:
			lfHeld = true;
			return false;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			rtHeld = true;
			return false;
		case KEYCODE_W:
		case KEYCODE_UP:
			fwdHeld = true;
			return false;
        case KEYCODE_S:
        case KEYCODE_DOWN:
            dnHeld = true;
            return false;
                
		case KEYCODE_ENTER:
			if (canvas.onclick == handleClick) {
				handleClick();
			}
			return false;
	}
}

function handleKeyUp(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_SPACE:
			shootHeld = false;
			break;
		case KEYCODE_A:
		case KEYCODE_LEFT:
			lfHeld = false;
			break;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			rtHeld = false;
			break;
		case KEYCODE_W:
		case KEYCODE_UP:
			fwdHeld = false;
			break;
		case KEYCODE_S:
        case KEYCODE_DOWN:
            dnHeld = false;
            break;
	}

    console.log(e.keyCode)
}



function reportWindowSize() {
	console.log(window.innerHeight)
	console.log(window.innerWidth)
}
