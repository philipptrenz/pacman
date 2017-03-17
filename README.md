#Pac-Man - Another implementation of the classic arcade game

## Description
This is an implementation of Pac-Man in the latest web technologies. The game is implemented using the HTML5 Canvas. The program logic is kept in pure JavaScript.
The last commit can be seen on [pacman.philipptrenz.de](http://pacman.philipptrenz.de)
This game is created in a course of my studies. My aim is to make the game modular and scalable as possible (in every respect). This means inter alia:

## Status
* The levels are generated from a background graphic
* The logic of characters are independent of the level
* The characters itself get loaded from image files
* All positions are held relative to the canvas, so the canvas can be scaled freely
* Although no ordinary design patterns like MVC are implemented, I try to keep model and view possible separately.

## Important Note
Even it is just pure JavaScript, the game has to run on a web server, like Apache. JavaScript has strict security rules for using images and image data in the HTML5 canvas, so that a web server is needed.
