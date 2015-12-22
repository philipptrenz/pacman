var canvas = null;
var ctx = null;

/* --------------------------------- */

var level = 0;			// start level is 0
const levelImages = 3;	// qunantity of level graphics under img/grid
const ghostImages = 3;	// quantity of ghost graphics under img/ghosts
const quantityOfGhosts = 3;


const quantityOfLifes = 3;
var life = quantityOfLifes;

const speed = 60;		// game speed in percent
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


// defines in which direction Pacman will move next.
//0 means stop, 1 means up, 2 is right, 3 is down and 4 is left.
var direction = 0;

// This initializes the game.
function initial() {

	/* --------------------------------- */

	var status = document.getElementById("lifes");
	status.innerHTML = null;
	for (var i = 0; i < life; i++) {
		status.innerHTML += "<i class='fa fa-heart'></i>";
	}

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

		// start logic iteration
		interval = setInterval(logic, getInterval());

		// start animation
		draw();
    }
}

/*
 * This method handles the logic part of the game.
 */
function logic() {

	if (isRunning) {
		if (dotCounter == 0) {
			nextLevel();
		}
		coughtDetection();	// does not recognize every time
		movePlayer();
		coughtDetection();	// too late
		moveGhosts();
		
	}
}

var now;
var then = Date.now();
var interval_frame = 1000/fps;
var delta;

/*
 * This method handles the whole view site of the game.
 */
function draw() {  
    requestAnimationFrame(draw);
     
    now = Date.now();
    delta = now - then;
     
    if (delta > interval_frame) {

        // update time stuffs     
        then = now - (delta % interval_frame);

        /* -------- CODE --------- */

       	ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0,0,canvas.width,canvas.height);	// clear canvas 
		// draw backgroundImage

		// game is paused
		if (!isRunning) {
			ctx.save();
			ctx.fillStyle="white";
			ctx.textAlign="center"; 
			if (isBeginning) {
				ctx.font = "normal normal 700 6em Montserrat";
				ctx.fillText("LEVEL "+(level+1), canvas.width/2, canvas.height/2*0.95);
				ctx.font = "normal normal normal 2.4em Montserrat";
				ctx.fillText("click to start", canvas.width/2, canvas.height/2*1.1);
			} else if (isGameover) {
				ctx.font = "normal normal 700 6em Montserrat";
				ctx.fillText("GAMEOVER", canvas.width/2, canvas.height/2*0.95);
				ctx.font = "normal normal normal 2.4em Montserrat";
				ctx.fillText("click to restart the game", canvas.width/2, canvas.height/2*1.1);
			}else if (isCought) {
				ctx.font = "normal normal 700 6em Montserrat";
				ctx.fillText("COUGHT", canvas.width/2, canvas.height/2*0.95);
				ctx.font = "normal normal normal 2.4em Montserrat";
				ctx.fillText("click to try again", canvas.width/2, canvas.height/2*1.1);
			} else if (isWon) { 
				ctx.font = "normal normal 700 6em Montserrat";
				ctx.fillText("YOU WON", canvas.width/2, canvas.height/2*0.95);
				ctx.font = "normal normal normal 2.4em Montserrat";
				ctx.fillText("click to play again", canvas.width/2, canvas.height/2*1.1);
			} else {
				ctx.font = "normal normal 700 6em Montserrat";
				ctx.fillText("PAUSED", canvas.width/2, canvas.height/2*0.95);
				ctx.font = "normal normal normal 2.4em Montserrat";
				ctx.fillText("click to continue", canvas.width/2, canvas.height/2*1.1);
			}
			
			// overlay
			ctx.fillStyle="rgba(44,62,80,0.8)";
			ctx.fillRect(0,0,canvas.width, canvas.height);
			ctx.restore();
		} else {
			isBeginning = false;
			isGameover = false;
			isCought = false;
		}
		
		
		 ctx.drawImage(grid.image, 
	    	0, 0, grid.image.width, grid.image.height, 
	    	0, 0, canvas.width, canvas.height);

		drawPacman();
		drawGhosts();

		// draw dots
		var wMax = grid.x
	    for (var w = 0; w < wMax; w++) {
	    	var hMax = grid.y
			for (var h = 0; h < hMax; h++) {
				if (dots[w][h]) {
					dot = getPixelCenter(w, h);
					ctx.beginPath();
				    ctx.arc(dot.x, dot.y, characterSize*0.15, 0, 2 * Math.PI);
				    ctx.fillStyle = '#cccccc';
				    ctx.fill();
				}
			}
			h = 0;
		}	
		
    }
}



/*
 * This function draws pacman depending on the grid position and also animates him.
 */
function drawPacman() {

	ctx.save();	// this lets just affect the translation to the following things
	
	// change direction of pacman
    if (direction == 4 && pacman.animation < 5) {	// pacman goes left
    	pacman.animation = pacman.animation+5;
    } else if (direction == 2 && pacman.animation > 4) {
    	pacman.animation = pacman.animation-5;
    }
    
	if (pacman.moved) {
		pacman.animate = true;
		pacman.step = 1;
		pacman.moved = false;
	}

	// get position
	var pos;

	if (pacman.animate) { 

		 // animate mouth
	    if (pacman.animation == 4 || pacman.animation == 9) pacman.animation -= 5;
	    pacman.animation++;

		// step in grid
		var step = pacman.step/getFramesPerInterval();
		// step in pixel
		var pixelStep = step*(canvas.width/grid.x);
		// do it
		if (pacman.y < pacman.prevY) {			// moved up
	    	ctx.translate(0,-pixelStep);
	    } else if (pacman.x > pacman.prevX) {	// moved right
	    	ctx.translate(pixelStep,0);
	    } else if (pacman.y > pacman.prevY) {	// moved down
	    	ctx.translate(0,pixelStep);
	    } else if (pacman.x < pacman.prevX) {	// moved left
	    	ctx.translate(-pixelStep,0);
	    }
	    // count up for next frame
	    pacman.step++;
	    // stop if transition ended
	    if (pacman.step > getFramesPerInterval()) {
	    	pacman.animate = false;
	    }

	    // take old position, which gets translated, see "translate()"-Function above
	    pos = getPixelCenter(pacman.prevX, pacman.prevY);
	} else {
		pos = getPixelCenter(pacman.x, pacman.y);
	}

   	// draw pacman
    ctx.drawImage(pacman.image[pacman.animation], pos.x-(characterSize/2), pos.y-(characterSize/2), characterSize, characterSize);

    ctx.restore();
}


/*
 * This method draws the ghosts to the canvas on their grid position.
 */
function drawGhosts() {

	// draw ghosts
	var length = ghost.length;
	for (var i = 0; i < length; i++) {
		ctx.save();	// this lets just affect the translation to the following things by saving the canvas and just manipulating the things down there

		if (ghost[i].moved) {
			ghost[i].moved = false;
			ghost[i].step = 1;
		}

		// position of the ghost
		var ghostPos;

		// step in grid
		var step = ghost[i].step/getFramesPerInterval();
		
		if (step < 1) { 		// && isRunning
			// step in pixel
			var pixelStep = step*(canvas.width/grid.x);
			// do it
			if (ghost[i].y < ghost[i].prevY) {			// moved up
		    	ctx.translate(0,-pixelStep);
		    } else if (ghost[i].x > ghost[i].prevX) {	// moved right
		    	ctx.translate(pixelStep,0);
		    } else if (ghost[i].y > ghost[i].prevY) {	// moved down
		    	ctx.translate(0,pixelStep);
		    } else if (ghost[i].x < ghost[i].prevX) {	// moved left
		    	ctx.translate(-pixelStep,0);
		    }
		    // count up for next frame
		    ghost[i].step++;
			ghostPos = getPixelCenter(ghost[i].prevX, ghost[i].prevY);
		} else {
			ghostPos = getPixelCenter(ghost[i].x, ghost[i].y);
		}
		
		// draw 
		ctx.drawImage(ghost[i].image, ghostPos.x-(characterSize/2), ghostPos.y-(characterSize/2), characterSize, characterSize);
		ctx.restore();	// restore the settings of the canvas
	}
}

/*
 * This method handles the moving of pacman depending on the key events.
 */ 
function movePlayer() {
	pacman.prevX = pacman.x;
	pacman.prevY = pacman.y;

    // navigate with keys
	if (direction == 1) {
		if (pacman.y-1 > 0) {
			var temp = borders[pacman.x][pacman.y-1];
			if (!temp) {
				pacman.y--;
				pacman.moved = true;
			}
		}
	} else if (direction == 2) {
		if (pacman.x+1 < grid.x) {
			var temp = borders[pacman.x+1][pacman.y];
			if (!temp) {
				pacman.x++;
				pacman.moved = true;
			}
		}
	} else if (direction == 3) {
		if (pacman.y+1 < grid.y) {
			var temp = borders[pacman.x][pacman.y+1];
			if (!temp) {
				pacman.y++;
				pacman.moved = true;
			}
		}
	} else if (direction == 4) {
		if (pacman.x-1 > 0) {
			var temp = borders[pacman.x-1][pacman.y];
			if (!temp) {
				pacman.x--;
				pacman.moved = true;
			}
		}
	}

	if (dots[pacman.x][pacman.y]) {
		dotCounter--;
		dots[pacman.x][pacman.y] = false;
	}
}

/* 
 * This method lets the ghosts move in the grid.
 */
function moveGhosts() {

	// ghost1 and ghost2
	var length = ghost.length;
	for (var i = 0; i < length; i++) {

		ghost[i].prevX = ghost[i].x;
		ghost[i].prevY = ghost[i].y;

		// max vision that ghost can "see" pacman
		var vision = ghost[i].vision;	

		// if distance in y between ghost and pacman is <= vision
		var seeInX = ghost[i].y == pacman.y && Math.abs(ghost[i].x - pacman.x) <= vision;

		// if distance in y between ghost and pacman is <= vision
		var seeInY = ghost[i].x == pacman.x && Math.abs(ghost[i].y - pacman.y) <= vision;

		// ghost can just see pacman if there's no border between them
		if (seeInX) {
			var corr = pacman.x-ghost[i].x > 0 ? 1 : -1;
			var test = ghost[i].x;
			while (test != pacman.x) {
				test += corr;
				if (borders[test][ghost[i].y]) {
					seeInX = false;
					break;
				}
			}
		} else if (seeInY) {
			var corr = pacman.y-ghost[i].y > 0 ? 1 : -1;
			var test = ghost[i].y;
			while (test != pacman.y) {
				test += corr;
				if (borders[ghost[i].x][test]) {
					seeInY = false;
					break;
				}
			}
		}

		// with a chance of 1 to 4 the ghost will no longer chase pacman
		if (seeInX && Math.floor(Math.random()*3) == 0) seeInX = false;
		if (seeInY && Math.floor(Math.random()*3) == 0) seeInY = false;


		if (seeInX) {
			var dir = pacman.x-ghost[i].x > 0 ? 1 : -1;
			ghost[i].x+=dir;
		} else if (seeInY) { // if distance in x between ghost and pacman is <= distance
			var dir = pacman.y-ghost[i].y > 0 ? 1 : -1;
			ghost[i].y+=dir;
		} else {
			
			// border collision detection
			var ok = [null, 
				!borders[ghost[i].x][ghost[i].y-1], 
				!borders[ghost[i].x+1][ghost[i].y],
				!borders[ghost[i].x][ghost[i].y+1],
				!borders[ghost[i].x-1][ghost[i].y]
			];

			// do the movement
			do {
				var ghostDirection = Math.floor(Math.random()*4)+1;
				if (ok[ghostDirection]) {
					if (ghostDirection == 1) {
						ghost[i].y--;
						break;
					} else if (ghostDirection == 2) {
						ghost[i].x++;
						break;
					} else if (ghostDirection == 3) {
						ghost[i].y++;
						break;
					} else if (ghostDirection == 4) {
						ghost[i].x--;
						break;
					}
				}
			} while (!ok[ghostDirection]);
		}
		ghost[i].moved = true;
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
}

/*
 * This function returns the acutual pixel position depending
 * on the grid position.
 */
function getPixelCenter(x, y) {
	var pixelX = x*(canvas.width/grid.x)+((canvas.width/grid.x)/2);
	var pixelY = y*(canvas.height/grid.y)+((canvas.height/grid.y)/2);
	return {"x": pixelX, "y": pixelY};
}

/*
 * Set interval for logic iteration, its an linear function.
 */
function getInterval() {
	// linear function f(x)=-7x+750
	return 750-(7*speed);
}


/*
 * This function calculates how many frames are showed 
 * depending on the interval of the calculation.
 */
function getFramesPerInterval() {
	return getInterval()*fps/1000;
}

/*
 * This function is called after completing a level,
 * it starts the next or stops the game if last level
 * is reached.
 */
function nextLevel() {
	clearInterval(interval);	// break out of loop
	direction = 0;
	dots = null;
	borders = null;

	level++;

	if (level == levelImages) {
		isWon = true;
	} else {
		isBeginning = true;
	}
	isRunning = false;
	initial();
}

/*
 * This function tests if pacman get cought by a ghost by
 * comparing the positions. Time when this method gets called
 * is important for correct detection.
 */
function coughtDetection() {
	// pacman gets cought
	var cought = false;
	var length = ghost.length;
	for (var i = 0; i < length; i++) {
		if (pacman.x == ghost[i].x && pacman.y == ghost[i].y) {
			cought = true;
		}
	}

	if (cought) {
		life--;
		clearInterval(interval);	// break out of loop
		direction = 0;
		isRunning = false;
		if (life == 0) {
			life = quantityOfLifes;
			level = 0;
			isGameover = true;
		} else {
			dots = null;
			isCought = true;
		}
		initial();
		cought = false;
	}
}

/*
 * This function starts the whole game.
 */
window.onload = function() {
	initial();
};

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
 * Handling for buttons in html for small devices
 */
function buttonClick(x) {
    direction = x;
}

function toggleRunning() {
	isRunning = !isRunning;
}