__Pac-Man - Just another implementation of the classic game__

This is an implementation of Pac-Man in the latest web technologies. The game is implemented using the HTML5 Canvas. The program logic is kept in pure JavaScript.

The last commit can be seen on [pacman.philipptrenz.de](http://pacman.philipptrenz.de)

This game is created in a course of my studies. My aim is to make the game modular and scalable as possible (in every respect). This means inter alia:

* The levels are generated from a background graphic
* The logic of characters are independent of the level
* The characters itself get loaded from image files
* All positions are held relative to the canvas, so the canvas can be scaled freely
* Now I still use PNG image files, but I want to move to pure vector graphics (I have to check out if it affects the performance, currently I have this feeling) 
* Although no ordinary design patterns like MVC are implemented, but I try to keep model and view possible separately.

This project is in development! Commits should be able to run, but until the release (sometime in February 2016) everything will be very buggy.

I am developing currently because of the performance on Google Chrome, but hope to have the game run stably on other browsrs at a later date.


__Important Note:__ 
_Even it is just pure JavaScript, the game has to run on a web server, like Apache. JavaScript has strict security rules for using images and image data in the HTML5 canvas, so that a web server is needed._
