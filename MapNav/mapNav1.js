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

var VIEWPORTSCALE = 2
var OBJECTSCALE = VIEWPORTSCALE * 2
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
    width: 40,
    height: 40,
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
var ghostShips = []

var islandInfo = {
	generationOdds: 0.2,
	islandFill: 0.3,
	distBtwn: 100,
	xTiles: 5,
	yTiles: 5,
	islandWidth: 60,
	islandLocations: [],
	border: 100,
	numIslands: 0,
}

var ghostShipInfo = {
	ghostShipOdds: 0.5,
	numGhostShips: 0,
	ghostLocations: [],
}

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

// optional health and ammo to implement
var playerAmmo = 100;
var playerHealth = 100;

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
	
	// generate island locations
	generateIslands()

    // reset control variables
	shootHeld = lfHeld = rtHeld = fwdHeld = dnHeld = false;
    
    //ensure stage is blank
	stage.clear();

	// add the game play elements

	// // healthField text
	// healthField = new createjs.Text("0", "bold 18px Arial", "#FFFFFF");
	// healthField.textAlign = "right";
	// healthField.x = canvas.width - 20;
	// healthField.y = 20;
	// healthField.maxWidth = 1000;
	
	// player ship
	
	// bitmap.scaleX = 50 / viewportHeight 
	// bitmap.scaleY = 50 / viewportHeight 


    //start game timer
	if (!createjs.Ticker.hasEventListener("tick")) {
		createjs.Ticker.addEventListener("tick", handleTick);
	}

}

function generateIslands() {
	// clear existing islands
	islands = []

	// calculate bounds for island generation
	let distX = viewportWidth - islandInfo.border - islandInfo.islandWidth
	let distY = viewportHeight - islandInfo.border - islandInfo.islandWidth

	islandInfo.xTiles = Math.floor(distX / islandInfo.distBtwn)
	islandInfo.yTiles = Math.floor(distY / islandInfo.distBtwn)

	console.log(islandInfo)

	islandInfo.numIslands = 0

	let islandArray

	while (islandInfo.numIslands < 3) {
		islandArray = new Array(islandInfo.yTiles).fill().map(() => Array(islandInfo.xTiles).fill(0));
		
		for (let j = 0; j < islandInfo.yTiles; j++) {
			for (let i = 0; i < islandInfo.xTiles; i++) {
				// check if any of the tiles above it are filled
				let isAdjacent = false

				if (j != 0 ) {
					if (i < islandInfo.xTiles - 1) {
						// check the top right corner cell
						isAdjacent = islandArray[j - 1][i + 1] > 0  || isAdjacent
					} 

					if (i != 0) {	
						// check top left cell
						isAdjacent = islandArray[j - 1][i - 1] > 0  || isAdjacent
					}

					// check the top middle cell
					isAdjacent = islandArray[j - 1][i] > 0  || isAdjacent
				} 
				
				if (i != 0) {
					// check left cell
					isAdjacent = islandArray[j][i - 1] > 0 || isAdjacent
				}
				
				// attempt to generate island if its not adjacent
				if (!isAdjacent) {
					if (Math.random() < islandInfo.generationOdds) {

						// add island and type to map
						islandArray[j][i] = Math.ceil(Math.random() * 3);

						islandInfo.numIslands++;
						
					}
				}
			}
		}
	}
	
	ghostArray = new Array(islandInfo.yTiles).fill().map(() => Array(islandInfo.xTiles).fill(0));

	let countedIslands = 0
	let countedGhosts = 0

	for (let i = 0; i < islandInfo.xTiles; i++) {
		for (let j = 0; j < islandInfo.yTiles; j++) {
			if (islandArray[j][i] > 0) {
				// render islands
				let image;
									
				switch (islandArray[j][i]) {
					case 1:
						image = preload.getResult("island1")
						break;
					case 2:
						image = preload.getResult("island2")
						break;
					default:
						image = preload.getResult("island3")							
				}

				let bitmap = new createjs.Bitmap(image)

				bitmap.scaleX = islandInfo.islandWidth / viewportHeight 
				bitmap.scaleY = islandInfo.islandWidth / viewportHeight 

				bitmap.x = islandInfo.border + i * islandInfo.distBtwn
				bitmap.y = islandInfo.border + j * islandInfo.distBtwn

				islands.push(bitmap)
				stage.addChild(islands[countedIslands])
				countedIslands++

				if (Math.random() < ghostShipInfo.ghostShipOdds) {
					// generate ghost ship
					ghostShipInfo.numGhostShips++;
					ghostArray[j][i] = 1;

					

					// render ghost ships
					image = preload.getResult("enemyShip")							

					bitmap = new createjs.Bitmap(image)
					bitmap.scaleX = player.width / viewportHeight 
					bitmap.scaleY = player.width / viewportHeight 

					bitmap.x = islandInfo.border + i * islandInfo.distBtwn + (islandInfo.distBtwn - islandInfo.islandWidth) * 2
					bitmap.y = islandInfo.border + j * islandInfo.distBtwn
					
					
					ghostShips.push(bitmap)
					stage.addChild(ghostShips[countedGhosts])
					countedGhosts++
					
				}

			}	
		}
	}

	islandInfo.islandLocations = islandArray
	ghostShipInfo.ghostLocations = ghostArray


	// iterate through bounds
}

function handleTick(event) {
    // console.log(playerSprite)
    
	// process player inputs
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

	// update enemy position


	// update cannonball rotation and posititions

	stage.update();
}

// Loading screen update functions
function updateLoading() {
	messageField.text = "Loading " + (preload.progress * 100 | 0) + "%";
	stage.update();
}

function doneLoading(event) {
	clearInterval(loadingInterval);

	stage.removeChild(messageField);

	var image = preload.getResult("pirateBattleIntro")
	overlayBitmap = new createjs.Bitmap(image);
	overlayBitmap.scaleX = 0.5 
	overlayBitmap.scaleY = 0.5
	overlayBitmap.x = (viewportWidth / 2) - (overlayBitmap.getTransformedBounds().width / 2)
	overlayBitmap.y = (viewportHeight / 2) - (overlayBitmap.getTransformedBounds().height / 2)
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
	// TODO: uncomment below
	// createjs.Sound.play("battleMusic");

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

	if (viewportHeight < 300) {
		console.log("viewport height too small")
	}

	if (viewportWidth < 300) {
		console.log("viewport width too small")
	}
}
