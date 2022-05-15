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
var KEYCODE_O = 79;			//useful keycode
var KEYCODE_P = 80;			//useful keycode

var VIEWPORTSCALE = 2
var OBJECTSCALE = VIEWPORTSCALE * 2

var SQRIMGHEIGHT = 1080

var ISLANDCOLLISIONRADIUS = 30
var GHOSTSHIPCOLLISIONRADIUS = 20
var GHOSTDAMAGERADIUS = 25
var PLAYERDAMAGERADIUS = 20

var COOLDOWNTIMERPLAYER = 30
var COOLDOWNTIMERENEMY = 30

// ----------------------------------------------

// Define variables
var shootHeld;			//is the user holding a shoot command
var shootLeftHeld;			//is the user holding a shoot command
var shootRightHeld;			//is the user holding a shoot command

var lfHeld;				//is the user holding a turn left command
var rtHeld;				//is the user holding a turn right command
var fwdHeld;			//is the user holding a forward command
var dnHeld;

var stage;
var preload;

// The player character
var player = {
    width: 40,
    height: 40,
	rotation: 90,
	health: 200,
	// ammo: 100,
	bitmap: null,
}; 

var islandInfo = {
	generationOdds: 0.2,
	islandFill: 0.3,
	distBtwn: 100,
	xTiles: 5,
	yTiles: 5,
	islandWidth: 60,
	islandLocations: [],
	islandCenters: [],
	border: 100,
	numIslands: 0,
}

var ghostShipInfo = {
	ghostShipOdds: 1,
	numGhostShips: 0,
	ghostLocations: [],
	ghostCenters: [],
	ghostHealth: [],
	cooldownTimers: [],
	rotationRate: 1.5,
	distCenter: 100,
	centerOffset: 20,
}

var cannonBall = {
	rotationSpeed: 5,
	speed: 10,
	width: 10,
	activePlayer: [],
	activeEnemy: [],
	numPlayer: 0,
	numEnemy: 0,
}

var playerSpeed = {
	euclidean: 0,
	x: 0,
	y: 0,

	rotationSpeed: 2,
	acceleration: 0.05,
	decceleration: 0.005,
	maxSpeed: 4,
}

// Bitmaps
// var waves = []
// var currents = []
var islands = []
var ghostShips = []


// Misc Messages
var messageField;		//Message display field
var scoreField;
var healthField;			//score Field


// timers
var shipCollisionDamageTicker = 0
var shootCooldownTimerPlayerL = 0
var shootCooldownTimerPlayerR = 0

var loadingInterval = 0;

var overlayBitmap

var gameState = "idle"


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
	shootLeftHeld = shootRightHeld = lfHeld = rtHeld = fwdHeld = dnHeld = false;
    
    //ensure stage is blank
	stage.clear();

	// // healthField text
	healthField = new createjs.Text("Health: " + String(player.health) + " / 200", "bold 18px Arial", "#15538c");
	healthField.textAlign = "right";
	healthField.x = canvas.width - 20;
	healthField.y = 20;
	healthField.maxWidth = 1000;

	stage.addChild(healthField);
	stage.update(); 
	
	// player ship
	let	image = preload.getResult("playerShip")							
	
	let bitmap = new createjs.Bitmap(image)
	bitmap.scaleX = player.width / viewportHeight 
	bitmap.scaleY = player.width / viewportHeight 

	bitmap.x = Math.floor(islandInfo.border/3 * 2) 
	bitmap.y = Math.floor(islandInfo.border/3 * 2) 
	
	bitmap.regX = bitmap.regY = SQRIMGHEIGHT / 2;

	bitmap.rotation = player.rotation
	
	player.bitmap = bitmap
	stage.addChild(player.bitmap)

	gameState = "playing"

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

	islandInfo.numIslands = 0

	let islandArray

	while (islandInfo.numIslands < 3) {
		islandArray = new Array(islandInfo.yTiles).fill().map(() => Array(islandInfo.xTiles).fill(0));
		
		for (let j = 0; j < islandInfo.yTiles; j++) {
			for (let i = 0; i < islandInfo.xTiles; i++) {
				if (i == 0 && j == 0) {
					continue;
				} 
				
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

	while (ghostShipInfo.numGhostShips < 3) {
		// console.log("here")
		let i = Math.floor(Math.random() * (islandInfo.xTiles))
		let j = Math.floor(Math.random() * (islandInfo.yTiles))

		if (islandArray[j][i] > 0 && ghostArray[j][i] == 0 && Math.random() < ghostShipInfo.ghostShipOdds) {
			// generate ghost ship
			ghostShipInfo.numGhostShips++;
			ghostArray[j][i] = 1;
		}

	}
	console.log(ghostArray)
	let countedIslands = 0
	var countedGhosts = 0


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

				islandInfo.islandCenters.push({
					x: islandInfo.border + i * islandInfo.distBtwn + islandInfo.islandWidth / 2 + ghostShipInfo.centerOffset,
					y: islandInfo.border + j * islandInfo.distBtwn + islandInfo.islandWidth / 2 + ghostShipInfo.centerOffset,
				})

				bitmap.x = islandInfo.border + i * islandInfo.distBtwn
				bitmap.y = islandInfo.border + j * islandInfo.distBtwn

				islands.push(bitmap)
				stage.addChild(islands[countedIslands])
				countedIslands++

				
				if (ghostArray[j][i] == 1) {
					// console.log("boo")
					// render ghost ships
					image = preload.getResult("enemyShip")						

					bitmap = new createjs.Bitmap(image)

					bitmap.x = islandInfo.border + i * islandInfo.distBtwn + islandInfo.islandWidth / 2 + ghostShipInfo.centerOffset
					bitmap.y = islandInfo.border + j * islandInfo.distBtwn + islandInfo.islandWidth / 2 + ghostShipInfo.centerOffset
					
					bitmap.regX = bitmap.regY = SQRIMGHEIGHT / 2;

					bitmap.scale = player.width / viewportHeight 
					
					ghostShips.push(bitmap)
					stage.addChild(ghostShips[countedGhosts])
					countedGhosts++

					ghostShipInfo.ghostCenters.push({
						x: islandInfo.border + i * islandInfo.distBtwn + islandInfo.islandWidth / 2 + ghostShipInfo.centerOffset,
						y: islandInfo.border + j * islandInfo.distBtwn + islandInfo.islandWidth / 2 + ghostShipInfo.centerOffset,
					})

					ghostShipInfo.ghostHealth.push(100)
					
				}

			}	
		}
	}

	console.log(ghostShipInfo.ghostCenters)
	console.log(islandInfo.islandCenters)

	islandInfo.islandLocations = islandArray
	ghostShipInfo.ghostLocations = ghostArray
}


function playerSpeedUpdate() { 

	if (playerSpeed.x > playerSpeed.decceleration) {
		playerSpeed.x -= playerSpeed.decceleration
	} else if (playerSpeed.x < - playerSpeed.decceleration) {
		playerSpeed.x += playerSpeed.decceleration
	} else {
		playerSpeed.x = 0
	}

	if (playerSpeed.x > playerSpeed.maxSpeed) {
		playerSpeed.x = playerSpeed.maxSpeed
	} else if (playerSpeed.x < - playerSpeed.maxSpeed) {
		playerSpeed.x = - playerSpeed.maxSpeed
	}

	if (playerSpeed.y > playerSpeed.decceleration) {
		playerSpeed.y -= playerSpeed.decceleration
	} else if (playerSpeed.y < - playerSpeed.decceleration) {
		playerSpeed.y += playerSpeed.decceleration
	} else {
		playerSpeed.y = 0
	}

	if (playerSpeed.y > playerSpeed.maxSpeed) {
		playerSpeed.y = playerSpeed.maxSpeed
	} else if (playerSpeed.y < - playerSpeed.maxSpeed) {
		playerSpeed.y = - playerSpeed.maxSpeed
	}

	player.bitmap.x += playerSpeed.x
	player.bitmap.y += playerSpeed.y
}

function keepPlayerInBounds() {
	if (player.bitmap.y > viewportHeight - player.height * 1.5 ) {
		player.bitmap.y = viewportHeight - player.height * 1.5 
		playerSpeed.y = - 0.005
	}
	if (player.bitmap.y < player.height ) {
		player.bitmap.y = player.height 
		playerSpeed.y = 0.005
	}
	if (player.bitmap.x > viewportWidth - player.width * 1.5 ) {
		player.bitmap.x = viewportWidth - player.width * 1.5 
		playerSpeed.x = - 0.005
	} 
	if (player.bitmap.x < player.width ) {
		player.bitmap.x = player.width
		playerSpeed.x = 0.005
	}
}

// TODO: code player health decrease 
function playerDamaged() {
	// check invincibiliity timer

	// set damage invincibility timer

	// decrease player healthby 1

}

// TODO: game over condition
function gameover() {

}


function keepPlayerOffIslands() {
	for (let i = 0; i < islandInfo.numIslands; i++) {
		let calc = calc2points(islandInfo.islandCenters[i].x, islandInfo.islandCenters[i].y,
			player.bitmap.x, player.bitmap.y
			)

		if (calc.distance < ISLANDCOLLISIONRADIUS + PLAYERDAMAGERADIUS) {
			
			// move the ship away from the island on the tangent
			player.bitmap.x = islandInfo.islandCenters[i].x + calcXfromEuclidean(calc.angle, ISLANDCOLLISIONRADIUS + PLAYERDAMAGERADIUS + 5)
			player.bitmap.y = islandInfo.islandCenters[i].y - calcYfromEuclidean(calc.angle, ISLANDCOLLISIONRADIUS + PLAYERDAMAGERADIUS + 5)

			playerSpeed.x = 0
			playerSpeed.y = 0

			playerDamaged()
		}
	}
}

function playerEnemyCollisionCheck() {
	for (let i = 0; i < ghostShipInfo.numGhostShips; i++) {
		let calc = calc2points(ghostShips[i].x, ghostShips[i].y,
			player.bitmap.x, player.bitmap.y
			)

		if (calc.distance < GHOSTSHIPCOLLISIONRADIUS + PLAYERDAMAGERADIUS) {
			
			// move the ship away from the island on the tangent
			player.bitmap.x = ghostShips[i].x + calcXfromEuclidean(calc.angle, GHOSTSHIPCOLLISIONRADIUS + PLAYERDAMAGERADIUS + 5)
			player.bitmap.y = ghostShips[i].y - calcYfromEuclidean(calc.angle, GHOSTSHIPCOLLISIONRADIUS + PLAYERDAMAGERADIUS + 5)

			playerSpeed.x = 0
			playerSpeed.y = 0

		}
	}
}


function fireCannonPort(shooter, x=0, y=0, rotation=0) {

	// create cannon ball bitmap
	image = preload.getResult("cannonBall")	
	bitmap = new createjs.Bitmap(image)

	bitmap.regX = bitmap.regY = SQRIMGHEIGHT / 2;
	bitmap.scale = cannonBall.width / viewportHeight 

	let spdX 
	let spdY

	if (shooter == "player") {
		bitmap.x = player.bitmap.x
		bitmap.y = player.bitmap.y

		// calculate ball speed
		spdX = calcXfromEuclidean((player.bitmap.rotation + 360 - 90)%360, cannonBall.speed)
		spdY = calcYfromEuclidean((player.bitmap.rotation + 360 - 90)%360, cannonBall.speed)
	} else {
		bitmap.x = x
		bitmap.y = y

		spdX= calcXfromEuclidean((rotation + 360 - 90)%360, cannonBall.speed)
		spdY= calcYfromEuclidean((rotation + 360 - 90)%360, cannonBall.speed)
	}

	var newBall = {
		direction: {
			x: spdX,
			y: spdY,
		},
		bitmap: bitmap
	}

	if (shooter == "player") {
		cannonBall.activePlayer.push(newBall)
		stage.addChild(cannonBall.activePlayer[cannonBall.numPlayer].bitmap)
		cannonBall.numPlayer++
	} else {
		cannonBall.activeEnemy.push(newBall)
		stage.addChild(cannonBall.activeEnemy[cannonBall.numEnemy].bitmap)
		cannonBall.numEnemy++
	}

}

function fireCannonStarboard(shooter, x=0, y=0, rotation=0) {
	// create cannon ball bitmap
	image = preload.getResult("cannonBall")	
	bitmap = new createjs.Bitmap(image)

	bitmap.regX = bitmap.regY = SQRIMGHEIGHT / 2;
	bitmap.scale = cannonBall.width / viewportHeight 

	let spdX 
	let spdY

	if (shooter == "player") {
		bitmap.x = player.bitmap.x
		bitmap.y = player.bitmap.y

		// calculate ball speed
		spdX = calcXfromEuclidean((player.bitmap.rotation + 360 + 90)%360, cannonBall.speed)
		spdY = calcYfromEuclidean((player.bitmap.rotation + 360 + 90)%360, cannonBall.speed)
	} else {
		bitmap.x = x
		bitmap.y = y

		spdX= calcXfromEuclidean((rotation + 360 + 90)%360, cannonBall.speed)
		spdY= calcYfromEuclidean((rotation + 360 + 90)%360, cannonBall.speed)
	}

	var newBall = {
		direction: {
			x: spdX,
			y: spdY,
		},
		bitmap: bitmap
	}

	if (shooter == "player") {
		cannonBall.activePlayer.push(newBall)
		stage.addChild(cannonBall.activePlayer[cannonBall.numPlayer].bitmap)
		cannonBall.numPlayer++
	} else {
		cannonBall.activeEnemy.push(newBall)
		stage.addChild(cannonBall.activeEnemy[cannonBall.numEnemy].bitmap)
		cannonBall.numEnemy++
	}
}


function enemyDamanged(j) {
	// reduce enemy health points
	ghostShipInfo.ghostHealth[j] -=  10

	if (ghostShipInfo.ghostHealth[j] <= 0) {
		// despawn the enemy

		// reduce enemy count

		// check if win (no enemy left)
	}
}

function cannonBallUpdates() {
	let cannonballsToDestroy = []

	// for each of the cannnon balls in the player array
	for (let i = 0; i < cannonBall.numPlayer; i++) {

		// update cannonball collision
		let cX = cannonBall.activePlayer[i].bitmap.x + cannonBall.activePlayer[i].direction.x
		let cY = cannonBall.activePlayer[i].bitmap.y + cannonBall.activePlayer[i].direction.y

		// check if cannonball is still on map
		if (cX < 0 || cY < 0 || cX > viewportWidth || cY > viewportHeight) {
			// destroy cannonball
			cannonballsToDestroy.push(i)
			continue
		}

		cannonBall.activePlayer[i].bitmap.x = cX
		cannonBall.activePlayer[i].bitmap.y = cY

		// check if collision with land
		if (cX > islandInfo.border && cX < viewportWidth - islandInfo.border) {
			if (cY > islandInfo.border && cY < viewportHeight - islandInfo.border) {
				// check which grid space
				let gridX = Math.floor((cX - islandInfo.border) / islandInfo.distBtwn)
				let gridY = Math.floor((cY - islandInfo.border) / islandInfo.distBtwn)

				// check if that grid has an island
				if (gridX < islandInfo.xTiles && gridY < islandInfo.yTiles) {
					if (islandInfo.islandLocations[gridY][gridX] == 1) {
						// check if in radius of the island touches the orb
						let calc = calc2points(islandInfo.islandCenters[gridX].x, islandInfo.islandCenters[gridY].y, 
							cX + cannonBall.width / 2, 
							cY + cannonBall.width / 2)

						if (calc.distance < ISLANDCOLLISIONRADIUS) {
							// destroy cannonball
							cannonballsToDestroy.push(i)
							continue;
						}
					}
				}
			}
		}

		//  check if collision with enemy
		for (let j = 0; j < ghostShipInfo.numGhostShips; j++) {
			let calc = calc2points(ghostShips[j].x, ghostShips[j].y, 
				cX + cannonBall.width / 2, 
				cY + cannonBall.width / 2)

			if (calc.distance < ISLANDCOLLISIONRADIUS) {
				console.log("landed a hit!")
				// destroy cannonball
				cannonballsToDestroy.push(i)

				enemyDamanged(j);
			}
		}
	}

	// destroy player cannon balls
	for (let i = 0; i < cannonballsToDestroy.length; i++ ) {

	}

	cannonballsToDestroy = []

	// for each of the cannon balls in the enemy array
	 


	// destroy enemy cannonballs

}

function cannonBallCollisionCheck() {

}


function handleTick(event) {
	if (gameState == "playing") {
		if (lfHeld) {
			playerSpeed.decceleration = 0.01
			player.bitmap.rotation -= playerSpeed.rotationSpeed
		} else {
			playerSpeed.decceleration = 0.005
		}
		
		if (rtHeld) {
			playerSpeed.decceleration = 0.010
			player.bitmap.rotation += playerSpeed.rotationSpeed
		} else {
			playerSpeed.decceleration = 0.005
		}

		while (player.bitmap.rotation < 0) {
			player.bitmap.rotation += 360
		}
		
		while (player.bitmap.rotation > 360) {
			player.bitmap.rotation -= 360
		}
		
		if (fwdHeld) {
			let accX = calcXfromEuclidean(player.bitmap.rotation, playerSpeed.acceleration)
			let accY = calcYfromEuclidean(player.bitmap.rotation, playerSpeed.acceleration)

			console.log(accX)
			playerSpeed.x += accX
			playerSpeed.y += accY
		}

		if (shootCooldownTimerPlayerL > 0) {
			shootCooldownTimerPlayerL -= 2
		}

		if (shootCooldownTimerPlayerR > 0) {
			shootCooldownTimerPlayerR -= 2
		}

		if (shootLeftHeld) {
			if (shootCooldownTimerPlayerL == 0) {
				// fire cannon ball from port
				shootCooldownTimerPlayerL = COOLDOWNTIMERPLAYER

				fireCannonPort("player")

			}
			
		}

		if (shootRightHeld) {
			if (shootCooldownTimerPlayerR == 0) {
				// fire cannon ball from starboard
				shootCooldownTimerPlayerR = COOLDOWNTIMERPLAYER

				fireCannonStarboard("player")

			}
		}

		// update player speed
		playerSpeedUpdate()

		// keep player in bounds
		keepPlayerInBounds()
		
		keepPlayerOffIslands()

		// update enemy position
		for (let i = 0; i < ghostShipInfo.numGhostShips; i++) {
			ghostShips[i].rotation -= ghostShipInfo.rotationRate
			let px = ghostShipInfo.ghostCenters[i].x + ghostShipInfo.distCenter  * Math.cos(ghostShips[i].rotation / 180 * Math.PI)
			let py = ghostShipInfo.ghostCenters[i].y + ghostShipInfo.distCenter * Math.sin(ghostShips[i].rotation / 180 * Math.PI)

			ghostShips[i].x = px
			ghostShips[i].y = py
		}

		cannonBallUpdates()

		// update cannonball rotation and posititions
		cannonBallCollisionCheck()


		// check player collision with enemy
		playerEnemyCollisionCheck()

		

	}

	stage.update();
}


// ------------------------------------------------------
// LOADING SCREEN ELEMENTS

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

// ------------------------------------------------------
// TRIGGER RESTART

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

// ------------------------------------------------------
// HANDLE KEYPRESSES

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		// case KEYCODE_SPACE:
		// 	shootHeld = true;
		// 	return false;

		case KEYCODE_O:
			shootLeftHeld = true;
			return false;
		case KEYCODE_P:
			shootRightHeld = true;
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
		// case KEYCODE_SPACE:
		// 	shootHeld = false;
		// 	break;
		case KEYCODE_O:
			shootLeftHeld = false;
			break;
		case KEYCODE_P:
			shootRightHeld = false;
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

// ------------------------------------------------------


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

// ------------------------------------------------------
// COLLISION MANAGEMENT


// // function to check for intersection between line segments
// // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
// function intersects(a,b,c,d,p,q,r,s) {
//     var det, gamma, lambda;
//     det = (c - a) * (s - q) - (r - p) * (d - b);
//     if (det === 0) {
//         return false;
//     } else {
//         lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
//         gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
//         return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
//     }
// };


function calc2points(x1, y1, x2, y2) {
	angle = 270 - (Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI)
	if (angle == 360) {
		angle = 0
	}

	let calc = {
		distance: Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) ),
		angle: angle
	}

	return calc
}

function calcXfromEuclidean(rotation, euclidean) {
	if (rotation == 0 || rotation == 180) {
		return 0
	} 

	if (rotation == 90 || rotation == 270) {
		return euclidean
	}
	
	if (rotation > 0 && rotation < 90) {
		return Math.cos((90-rotation)/180 * Math.PI) * euclidean
	}

	if (rotation > 90 && rotation < 180) {
		return Math.cos((rotation - 90)/180 * Math.PI) * euclidean
	}

	if (rotation > 180 && rotation < 270) {
		return - Math.cos((270 - rotation)/180 * Math.PI) * euclidean
	}

	if (rotation > 270) {
		return - Math.cos((rotation - 270)/180 * Math.PI) * euclidean
	}

	return 0
}

function calcYfromEuclidean(rotation, euclidean) {
	if (rotation == 0 || rotation == 180) {
		return euclidean
	} 

	if (rotation == 90 || rotation == 270) {
		return 0
	}
	
	if (rotation > 0 && rotation < 90) {
		return - Math.sin((90-rotation)/180 * Math.PI) * euclidean
	}

	if (rotation > 90 && rotation < 180) {
		return Math.sin((rotation - 90)/180 * Math.PI) * euclidean
	}

	if (rotation > 180 && rotation < 270) {
		return Math.sin((270 - rotation)/180 * Math.PI) * euclidean
	}

	if (rotation > 270) {
		return - Math.sin((rotation - 270)/180 * Math.PI) * euclidean
	} 

	console.log("Error" + String(rotation) + "," + String(euclidean))

	return 0
}
