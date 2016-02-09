var canvas = null;
var ctx = null;

/* --------------------------------- */

var level = 0;			// start level is 0
const levelImages = 3;	// qunantity of level graphics under img/grid
const ghostImages = 3;	// quantity of ghost graphics under img/ghosts
const quantityOfGhosts = 3;


const quantityOfLifes = 3;
var life = quantityOfLifes;


const startSpeed = 60;		// game speed in percent
var speed = startSpeed;
const fps = 25;			// frames per second
/* --------------------------------- */

var characterSize;

var grid = new Array();
var pacman = new Array();
var ghost = new Array();

// game states
var isRunning = false;
var isBeginning = true;
var isGameover = false;
var isCought = false;
var isWon = false;

// This variable contains an boolean two dimensional array like borders[x][y],
// It contains, if on the position on the grid is a border or not.
var borders;

var dots;
var dotCounter = 0;
var quantityOfDots;


// defines in which direction Pacman will move next.
//0 means stop, 1 means up, 2 is right, 3 is down and 4 is left.
var direction = 0;

/*
 * This function starts the whole game.
 */
window.onload = function() {
	initial();
};

// This initializes the game.
function initial() {

	var status = document.getElementById("lifes");
	status.innerHTML = null;
	for (var i = 0; i < life; i++) {
		status.innerHTML += "<i class='fa fa-heart'></i>";
	}

	/* --------------------------------- */
	
	// lets the game get faster every level
	speed = startSpeed+level*3;

	/* --------------------------------- */
	
	// get canvas
	canvas = document.getElementById("game");

	// get canvas context
    ctx = canvas.getContext("2d");

	/* --------------------------------- */

	grid = {
		"x": 20,
		"y": 15,
		"image": new Image()
	};
	grid.image.src = 'img/grid/grid'+level+'.png';

    /* --------------------------------- */

    pacman = {
    	"x": 1,
		"y": 7,
		"prevX": pacman.x,
		"prevY": pacman.y,
    	"image": new Array(),
    	"moved": false,
    	"animate": false,
    	"animation": 0,
    	"step": null
    }

    for (var i = 0; i < 10; i++) {
    	pacman.image[i] = new Image();
    	var att;
    	var corr;
    	if (i < 5) {
    		att = "r";
    		corr = 0;
    	} else {
    		att = "l";
    		corr = 5;
    	}
    	pacman.image[i].src = "img/pacman/pacman"+(i-corr)+att+".svg";
    }

    /* --------------------------------- */

    for (var i = 0; i < quantityOfGhosts; i++) {
    	ghost[i] = {
    		"x": Math.round(grid.x/2),				// the x position of the ghost in the grid
			"y": Math.round(grid.y/2),				// the y position of the ghost in the grid
			"prevX": Math.round(grid.x/2),
			"prevY": Math.round(grid.y/2),
			"image": new Image(),
			"moved": false,
			"step": new Array(),	
			"vision": 5				// how wide the ghost can "see"
    	};
    	ghost[i].image.src = 'img/ghosts/ghost'+(i%ghostImages)+'.svg';
    }

    /* --------------------------------- */

    characterSize = (canvas.width/grid.x)*0.9;

    // loading images is asynchronous, so it has to be
    // ensured that the following gets executed after
    // loading the image
    grid.image.onload = function() {
    	// clear canvas
    	ctx.clearRect(0,0,canvas.width,canvas.height);

    	// draw image
    	ctx.drawImage(grid.image, 
	    	0, 0, grid.image.width, grid.image.height, 
	    	0, 0, canvas.width, canvas.height);

		// analyze image for borders
		getBorders();

		// create dots on every place where no border is
		createDots();

		/* --------------------------------- */

		// fix for long loading times by generating borders and dots
		var ready = true;
		do {
			for (var w = 0; w < grid.x; w++) {
				for (var h = 0; h < grid.y; h++) {
					if (borders[w][h] == null) ready = false;
					if (borders[w][h] == false) {
						if (dots[w][h] == null) ready = false;
					}
				}
			}
		} while (!ready);

		/* --------------------------------- */

		// start logic iteration
		interval = setInterval(logic, getInterval());

		// start animation
		draw();
    }
}

/*
 * Fill borders array.
 * Test if picture is transparent or not on a specific position,
 * if not transparent its a border.
 */
function getBorders() {

	borders = new Array();

	var pixelX = canvas.width/grid.x;	// width of one pixel in the grid
	var pixelY = canvas.height/grid.y;	// height of one pixel in the grid

	var startPixelX = pixelX/2;	// for isBeginningning the first x-position is middle of the first grid-pixel in x
	var startPixelY = pixelY/2;	// same for y
	
	var x = startPixelX;
	var y = startPixelY;

	var w = 0, h = 0;

	var wMax = grid.x;
	for (w; w < wMax; w++) {
		borders[w] = new Array();

		var hMax = grid.y;
		for (h; h < hMax; h++) {
			var isBorder = ctx.getImageData(x,y,1,1).data[3] != 0;  // test if transparency of grid image, if != 0 its a border
			borders[w][h] = isBorder;
			y += pixelY;	// go to next horizontal pixel
		}
		h = 0;
		y = startPixelY;	// reset horizontal pixel for next row
		x += pixelX;		// go to next pixel row
	}
}

/*
 * Set interval for logic iteration, its an linear function.
 */
function getInterval() {
	// linear function f(x)=-7x+750
	return 750-(7*speed);
}


/*
 * This function sets one dot on every not-wall grid field
 * all pixel get saved in dots.
 */
function createDots() {
	var tempDotCounter = 0;

	dots = new Array();
	var w = 0, h = 0;
	var wMax = grid.x;
	for (w; w < wMax; w++) {
		dots[w] = new Array();

		var hMax = grid.y;
		for (h; h < hMax; h++) {
			if (!borders[w][h]) {
				dots[w][h] = true;
				tempDotCounter++;
			}
		}
		h = 0;
	}
	dotCounter = tempDotCounter;
	quantityOfDots = dotCounter;
}

/*
 * Handling the key events.
 */
document.onkeydown = changeDirection;
function changeDirection(e) {
	
	var key  = e.keyCode || e.which;

	if (isRunning) {
		if (key == 38) {	// up
			direction = 1;
		}	
		if (key == 39) {	// right
			direction = 2;
		}
		if (key == 40) {	// down
			direction = 3;
		}
		if (key == 37) {	// left
			direction = 4;
		}
	}
	
	if (key == 32) {
		// prevent default action on space bar permanent
		e.preventDefault();

		// toggle isRunning
		toggleRunning();
	}

	// disable scrolling via arrow keys and all other default functions of the keyboard
	if (isRunning) e.preventDefault();
}

/*
 * Handling for buttons in html for small devices.
 */
function buttonClick(x) {
    direction = x;
}
/*
 * This function toggles if the game is running.
 */
function toggleRunning() {
	isRunning = !isRunning;
}