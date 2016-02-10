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
				ctx.fillText("CAUGHT", canvas.width/2, canvas.height/2*0.95);
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
		
		// draw backgroundImage
		ctx.drawImage(grid.image, 
	    	0, 0, grid.image.width, grid.image.height, 
	    	0, 0, canvas.width, canvas.height);

		drawPacman();
		drawGhosts();

		// draw dots
		try {
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
		} catch (e) {
			// do nothing
			// not critical, just annoying
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
 * This function returns the acutual pixel position depending
 * on the grid position.
 */
function getPixelCenter(x, y) {
	var pixelX = x*(canvas.width/grid.x)+((canvas.width/grid.x)/2);
	var pixelY = y*(canvas.height/grid.y)+((canvas.height/grid.y)/2);
	return {"x": pixelX, "y": pixelY};
}

/*
 * This function calculates how many frames are showed 
 * depending on the interval of the calculation.
 */
function getFramesPerInterval() {
	return getInterval()*fps/1000;
}