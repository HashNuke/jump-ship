# JumpShip - you jump, the ship jumps

Checkout Wasim playing the game - <https://twitter.com/HashNuke/status/536423473707753473>

Makes you move, keeps you fit.

![screenshot](https://github.com/HashNuke/jump-ship/raw/master/screenshot.png "Screenshot")


## Requirements

* Any Arduino compatible board
  * connected to the computer with a USB cable
* Load this project dir as a Chrome app on <chrome://extensions>, using the "Load unpacked extension" button.
* Two wires
* a jump board (you can make one with 2 card-board pieces)

## How to make the jump board

* Take 2 wires
* Connect one to pin-2 and another to ground (pin labelled GND on the board)
* Stick the other ends of the wires to one card-board each, such that when placed together they touch

## Setup & run

* Burn the `ino` program to your Intel Galileo board.
* Open the Chrome app and choose the port of your Galileo board
* Click "start"


## TODO

* Start the game with 2 jumps
* Document circuit (well just about saying where to plug the 2 wires)
* Explosion on crashing
* Restart the game after a message


## Credits (other than me :P)

* Paulami and Rasagy for helping me flesh out the idea
* Rishi, Ajith and Wasim for brainstorming ideas, table chat
