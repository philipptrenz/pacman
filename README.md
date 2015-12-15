__Pac-Man - Just another implementation of the classic game__

This is an implementation of Pac-Man in the latest web technologies. The game is implemented using the HTML5 Canvas. The program logic is kept in pure JavaScript.

This game is created in the course of my studies. My aim is to the game as possible modular and scalable to make (in every respect). This means inter alia:

* The levels are generated from a background graphic
* The logic of Charaktäre is independent of the level
* All positions are held relative to the canvas, so the canvas can be scaled freely
* Although no ordinary design patterns like MVC is implemented, I try to keep model and view possible separately.

This project is in development! Commits are expected to always be able to run, but until the release (no later than mid-February 2016) will run all not very good.

I am developing currently because of the performance on Google Chrome, but hope to have the game run stably at a later date on other browsers.


__Important Note:__ _Even it is just pure JavaScript, the game has to run on a web server, like Apache. JavaScript has strict security rules for using images and image data in the HTML5 canvas, so that a web server is needed._
