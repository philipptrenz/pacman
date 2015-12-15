
var canvas = null;
var ctx = null;

var backgroundImage = [new Image(), new Image(), new Image()];
backgroundImage[0].src = 'img/grid/grid0.png';
backgroundImage[1].src = 'img/grid/grid1.png';
backgroundImage[2].src = 'img/grid/grid2.png';

var pacmanImage = new Array();
var pacmanAnimation = 0;

var ghostImage = [new Image(), new Image(), new Image()];
ghostImage[0].src = 'img/ghosts/ghost0.svg';
ghostImage[1].src = 'img/ghosts/ghost1.svg';
ghostImage[2].src = 'img/ghosts/ghost2.svg';

var grid = {"x": 20, "y": 15};

var player;
var playerMoved = false;
var playerPrev;
var ghost = new Array();
var ghostMoved = new Array();

var characterSize;

const speed = 80;		// game speed in percent
const fps = 25;

var level = 2;		// the game level
const lastLevel = 2;

var life = 3;		// lives get reduced if ghost touches pacman.

/*
 * This variable contains an boolean two dimensional array like borders[x][y],
 * It contains, if on the position on the grid is a border or not.
 */
var borders;
var dots;

var dotCounter = 0;

/*
 * defines in which direction Pacman will move next.
 * 0 means stop, 1 means up, 2 is right, 3 is down and 4 is left.
 */
var direction = 0;

function initial() {
	// get canvas
	canvas = document.getElementById("game");
	// get canvas context
    ctx = canvas.getContext("2d");


	pacmanX = 20;
    pacmanY = canvas.height/2;

    characterSize = (canvas.width/grid.x)*0.9;

    /* --------------------------------- */
    for (var i = 0; i < 10; i++) {
    	pacmanImage[i] = new Image();
    	var att;
    	var corr;
    	if (i < 5) {
    		att = "r";
    		corr = 0;
    	} else {
    		att = "l";
    		corr = 5;
    	}
    	pacmanImage[i].src = "img/pacman/pacman"+(i-corr)+att+".svg";
    }


    // define start position of pacman
    player = {"x": 1, "y": 7};
    playerPrev = {"x": player.x, "y": player.y};

    // define start position of ghosts
    ghost = [{"x": 7, "y": 7},{"x": 9, "y": 7},{"x": 11, "y": 7}]; // make random later
    ghostPrev = ghost;
    ghostMoved = [false, false, false];

    // generate level
    ctx.drawImage(backgroundImage[level], 
    	0, 0, backgroundImage[level].width, backgroundImage[level].height, 
    	0, 0, canvas.width, canvas.height);

    getBorders();
    createDots();

    // start logic iteration
    interval = setInterval(logic, getInterval());

    // Start animation
    //window.requestAnimationFrame(painting);
    draw();
}

function logic() {
	if (dotCounter == 0) {
		clearInterval(interval);	// break out of loop
		nextLevel();
	}

	movePlayer();
	moveGhosts();

	coughtDetection();
}

var now;
var then = Date.now();
var intervall_frame = 1000/fps;
var delta;
  
function draw() {     
    requestAnimationFrame(draw);
     
    now = Date.now();
    delta = now - then;
     
    if (delta > intervall_frame) {
        // update time stuffs
         
        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
         
        then = now - (delta % interval);

        /* -------- CODE --------- */
         
		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0,0,canvas.width,canvas.height);	// clear canvas
		// draw backgroundImage
		
		ctx.drawImage(backgroundImage[level], 
	    	0, 0, backgroundImage[level].width, backgroundImage[level].height, 
	    	0, 0, canvas.width, canvas.height);

		drawPacman();
		drawGhosts();

		// draw dots
	    for (var w = 0; w < grid.x; w++) {
			for (var h = 0; h < grid.y; h++) {
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


var pacmanStep;
var animate = false;
function drawPacman() {

	ctx.save();	// this lets just affect the translation to the following things
	
	// change direction of pacman
    if (direction == 4 && pacmanAnimation < 5) {	// pacman goes left
    	pacmanAnimation = pacmanAnimation+5;
    } else if (direction == 2 && pacmanAnimation > 4) {
    	pacmanAnimation = pacmanAnimation-5;
    }

   

    // animate mouth
    if (pacmanAnimation == 4 || pacmanAnimation == 9) pacmanAnimation -= 5;
    pacmanAnimation++;
    
	if (playerMoved) {
		animate = true;
		pacmanStep = 1;
		playerMoved = false;
	}

	// get position
	var pos;

	if (animate) {	// könnte auch entfernt werden, höchstens um ressourcen zu schonen sinnvoll
		// step in grid
		var step = pacmanStep/getFramesPerInterval();
		// step in pixel
		var pixelStep = step*(canvas.width/grid.x);
		// do it
		if (player.y < playerPrev.y) {			// moved up
	    	ctx.translate(0,-pixelStep);
	    } else if (player.x > playerPrev.x) {	// moved right
	    	ctx.translate(pixelStep,0);
	    } else if (player.y > playerPrev.y) {	// moved down
	    	ctx.translate(0,pixelStep);
	    } else if (player.x < playerPrev.x) {	// moved left
	    	ctx.translate(-pixelStep,0);
	    }
	    // count up for next frame
	    pacmanStep++;
	    // stop if transition ended
	    if (pacmanStep > getFramesPerInterval()) {
	    	animate = false;
	    }

	    // take old position, which gets translated, see "translate()"-Function above
	    pos = getPixelCenter(playerPrev.x, playerPrev.y);
	} else {
		pos = getPixelCenter(player.x, player.y);
	}

   	// draw pacman
    ctx.drawImage(pacmanImage[pacmanAnimation], pos.x-(characterSize/2), pos.y-(characterSize/2), characterSize, characterSize);

    ctx.restore();
}

function drawGhosts() {
	// draw ghosts
	for (var i = 0; i < ghost.length; i++) {
		ctx.save();	// this lets just affect the translation to the following things by saving the canvas and just manipulating the things down there

		var ghostPos = getPixelCenter(ghost[i].x, ghost[i].y);

		// draw 
		ctx.drawImage(ghostImage[i], ghostPos.x-(characterSize/2), ghostPos.y-(characterSize/2), characterSize, characterSize);

		ctx.restore();	// restore the settings of the canvas
	}
}

function movePlayer() {
	playerPrev = {"x": player.x, "y": player.y};

    // navigate with keys
	if (direction == 1) {
		if (player.y-1 > 0) {
			var temp = borders[player.x][player.y-1];
			if (!temp) {
				player.y--;
				playerMoved = true;
			}
		}
	} else if (direction == 2) {
		if (player.x+1 < grid.x) {
			var temp = borders[player.x+1][player.y];
			if (!temp) {
				player.x++;
				playerMoved = true;
			}
		}
	} else if (direction == 3) {
		if (player.y+1 < grid.y) {
			var temp = borders[player.x][player.y+1];
			if (!temp) {
				player.y++;
				playerMoved = true;
			}
		}
	} else if (direction == 4) {
		if (player.x-1 > 0) {
			var temp = borders[player.x-1][player.y];
			if (!temp) {
				player.x--;
				playerMoved = true;
			}
		}
	}

	if (dots[player.x][player.y]) {
		dotCounter--;
		dots[player.x][player.y] = false;
	}
}

function moveGhosts() {

	// ghost1 and ghost2
	for (var i = 0; i < ghost.length; i++) {
		// border collision detection
		var ok = [null, 
			!borders[ghost[i].x][ghost[i].y+1], 
			!borders[ghost[i].x+1][ghost[i].y],
			!borders[ghost[i].x][ghost[i].y-1],
			!borders[ghost[i].x-1][ghost[i].y]
		];

		// do the movement
		while (!ok[ghostDirection]) {
			var ghostDirection = Math.floor(Math.random()*4)+1;
			if (ok[ghostDirection]) {
				if (ghostDirection == 1) {
					ghost[i].y++;
				} else if (ghostDirection == 2) {
					ghost[i].x++;
				} else if (ghostDirection == 3) {
					ghost[i].y--;
				} else if (ghostDirection == 4) {
					ghost[i].x--;
				}
			}
		}
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

	var startPixelX = pixelX/2;	// for beginning the first x-position is middel of the first grid-pixel in x
	var startPixelY = pixelY/2;	// for beginning the first x-position is middel of the first grid-pixel in y
	
	var x = startPixelX;
	var y = startPixelY;

	var w = 0, h = 0;

	for (w; w < grid.x; w++) {
		borders[w] = new Array();

		for (h; h < grid.y; h++) {
			borders[w][h] = ctx.getImageData(x,y,1,1).data[3] != 0;	// test if transparency of grid image, if != 0 its a border
			y += pixelY;	// go to next horizontal pixel
		}
		h = 0;
		y = startPixelY;	// reset horizontal pixel for next row
		x += pixelX;		// go to next pixel row
	}
}

function createDots() {
	var tempDotCounter = 0;

	dots = new Array();
	var w = 0, h = 0;
	for (w; w < grid.x; w++) {
		dots[w] = new Array();

		for (h; h < grid.y; h++) {
			if (!borders[w][h]) {
				dots[w][h] = true;
				tempDotCounter++;
			}
		}
		h = 0;
	}
	dotCounter = tempDotCounter;
}

function getPixelCenter(x, y) {
	var pixelX = x*(canvas.width/grid.x)+((canvas.width/grid.x)/2);
	var pixelY = y*(canvas.height/grid.y)+((canvas.height/grid.y)/2);
	return {"x": pixelX, "y": pixelY};
}

/*
 * Set interval for logic iteration
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

function nextLevel() {
	alert("Herzlichen Glückwunsch! \nSie haben Level "+(level+1)+" geschafft!");

	ctx.clearRect(0,0,canvas.width,canvas.height);	// clear canvas
	direction = 0;
	player = null;
	borders = null;
	dots = null;
	dotCounter = null;
	maxDots = null;

	level++;
	if (level > lastLevel) {
		gameover();
	}

	initial();
}

function coughtDetection() {
	// pacman gets cought
	for (var i = 0; i < ghost.length; i++) {
		if (player.x == ghost[i].x && player.y == ghost[i].y) {
			clearInterval(interval);	// break out of loop
			cought();
		}
	}
}

function cought() {
	if (life == 1) {
		gameover();
	} else {
		life--;

		alert("Erwischt! \nEs verbleiben Ihnen "+life+" Leben.");

		ctx.clearRect(0,0,canvas.width,canvas.height);	// clear canvas
		direction = 0;
		player = null;
		borders = null;
		dots = null;
		dotCounter = null;

		initial();
	}
}



function gameover() {

	var message = "Game Over";
	if (level > lastLevel) message+="\nSie haben gewonnen!"

	ctx.clearRect(0,0,canvas.width,canvas.height);	// clear canvas
	direction = 0;
	player = null;
	borders = null;
	dots = null;
	dotCounter = null;
	alert(message);
}


window.onload = function() {
	initial();
};

document.onkeydown = changeDirection;
function changeDirection(e) {
	var key  = e.keyCode || e.which;
	/*
	if (key == 38 && !borders[player.x][player.y-1]) {
		direction = 1;
	}
	if (key == 39 && !borders[player.x+1][player.y]) {
		direction = 2;
	}
	if (key == 40 && !borders[player.x][player.y+1]) {
		direction = 3;
	}
	if (key == 37 && !borders[player.x-1][player.y]) {
		direction = 4;
	}*/
	if (key == 38) {
		direction = 1;
	}
	if (key == 39) {
		direction = 2;
	}
	if (key == 40) {
		direction = 3;
	}
	if (key == 37) {
		direction = 4;
	}
}