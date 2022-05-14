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
    x: 100,
    y: 100,
    width: 50,
    height: 50,
	bitmap: null,
}; // The player character

var enemy = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
	bitmap: null,
}; // The enemy character

var waves = []
var currents = []
var balls = []
var islands = []


var messageField;		//Message display field
var scoreField;
var healthField;			//score Field


var playerSpeed = {
	euclidean: 0,
	x: 0,
	y: 0,
}
var acceleration = 3;
var maxSpeed = 27;

var playerAmmo = 100;
var cannonBallRotation = 5;

var loadingInterval = 0;

var overlayBitmap

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

	// identify the stage
    canvas = document.getElementById("mapCanvas");
	canvas.height = viewportHeight 
	canvas.width = viewportWidth
	stage = new createjs.Stage(canvas);

	// message field for loading
	messageField = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = viewportWidth / 2;
	messageField.y = viewportHeight / 2;
	stage.addChild(messageField);
	stage.update(); 	//update the stage to show text


    // begin loading content (only sounds to load)
	var assetsPath = "../Assets/";
	manifest = [
		{id: "cannonBall", src: "images/cannonBall.png"},
		{id: "enemyShip", src: "images/enemyShip.png"},
		{id: "playerShip", src: "images/playerShip.png"},
		{id: "simpleShip", src: "images/simpleShip.png"},
		{id: "waves1", src: "images/waves1.png"},
		{id: "waves2", src: "images/waves2.png"},
		{id: "whirlpool", src: "images/whirlpool.png"},
		{id: "island1", src: "images/island1.png"},
		{id: "island2", src: "images/island2.png"},
		{id: "island3", src: "images/island3.png"},
		{id: "current1", src: "images/current1.png"},
		{id: "current2", src: "images/current2.png"},
		{id: "pirateBattleIntro", src: "images/pirateBattleIntro.png"},
		
		{id: "battleMusic", src: "sounds/battleMusic.mp3"},
	];

	createjs.Sound.alternateExtensions = ["mp3"];

	// preload assets
    preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed
	preload.addEventListener("progress", updateLoading);
	preload.loadManifest(manifest);

    createjs.Ticker.framerate = 60; 
    createjs.Ticker.addEventListener("tick", handleTick);
}


// restart the game if the player looses
function restart() {
    // clear the stage
    stage.removeAllChildren();

    // reset game variables
	

    // reset control variables
	shootHeld = lfHeld = rtHeld = fwdHeld = dnHeld = false;
    
    //ensure stage is blank
	stage.clear();

	// add the game play elements


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

	stage.update();
}

// Loading screen update functions
function updateLoading() {
	messageField.text = "Loading " + (preload.progress * 100 | 0) + "%";
	stage.update();
}

function doneLoading(event) {
	clearInterval(loadingInterval);

	// // scorefield text
	// scoreField = new createjs.Text("0", "bold 18px Arial", "#FFFFFF");
	// scoreField.textAlign = "right";
	// scoreField.x = canvas.width - 20;
	// scoreField.y = 20;
	// scoreField.maxWidth = 1000;

	stage.removeChild(messageField);

	var image = preload.getResult("pirateBattleIntro")
	overlayBitmap = new createjs.Bitmap(image);
	overlayBitmap.scaleX = 0.5 
	overlayBitmap.scaleY = 0.5
	overlayBitmap.x = (viewportWidth / 2) - (overlayBitmap.getTransformedBounds().width / 2)
	overlayBitmap.y = (viewportHeight / 2) - (overlayBitmap.getTransformedBounds().height / 2)

	// bitmap.scaleX = 50 / viewportHeight 
	// bitmap.scaleY = 50 / viewportHeight 
	stage.addChild(overlayBitmap)

	// start the music
	// TODO: uncomment line below
	// createjs.Sound.play("battleMusic", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});

	watchRestart();
}

function watchRestart() {
	//watch for clicks
	stage.update(); 	//update the stage to show text
	canvas.onclick = handleClick;
}

function handleClick() {
	//prevent extra clicks and hide text
	canvas.onclick = null;

	// indicate the player is now on screen
	createjs.Sound.play("battleMusic");

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


// resize the window
function reportWindowSize() {
	viewportHeight = window.innerHeight;
	viewportWidth = window.innerWidth;
	console.log(window.innerHeight)
	console.log(window.innerWidth)
}