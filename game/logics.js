/*
 * This method handles the logic part of the game.
 */
function logic() {

	if (isRunning) {
		if (dotCounter == 0) nextLevel();

		coughtDetection();
		movePlayer();
		coughtDetection();
		moveGhosts();
	}	
}

/*
 * This method handles the moving of pacman depending on the key events.
 */ 
function movePlayer() {
	pacman.prevX = pacman.x;
	pacman.prevY = pacman.y;

    // navigate
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
	try {
		if (dots[pacman.x][pacman.y]) {
			dotCounter--;
			dots[pacman.x][pacman.y] = false;
		}
	} catch (e) {
		// do nothing
		// not critical, just annoying
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

		// with a chance of 1 to 10 the ghost will no longer chase pacman
		if (seeInX && Math.floor(Math.random()*7) == 0) seeInX = false;
		if (seeInY && Math.floor(Math.random()*7) == 0) seeInY = false;


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
		gameover();
		level=0;
		life = quantityOfLifes;
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
		if (life == 0) {			// gameover
			gameover();

			life = quantityOfLifes;
			level = 0;
			time = 0;
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
 * This function handles all the things by gameover
 */
function gameover() {
	
	// quantity of eaten dots
	var eatenDots = quantityOfDots-dotCounter;

	// calculate factor for previous levels
	var factorPrevLevels = 0;
	for (var i = 0; i < level; i++) {
		factorPrevLevels += i+1;
	}

	// calculate highscore depending on previous levels
	var highscore = grid.x*grid.y*factorPrevLevels;

	// add eaten dots of this level
	highscore += eatenDots*(level+1);

	// extra points for every left life depending on level
	highscore += life*(level+1)*2;

	// because.
	highscore *= 42;

	/* ----------------------------------------------------------------------------- */

	document.getElementById("register").style.display = "table-row";

	setTimeout(function () {
		document.getElementById("showHighscore").innerHTML = highscore;
		document.getElementById("score").value = highscore;

		document.getElementById("shadowlink").click();
	}, 500);

	setTimeout(function () {
		document.getElementById("nickname").focus();
		if (level != levelImages) {
			isBeginning = true;
			isGameover = false;
		}
	}, 1500);
}