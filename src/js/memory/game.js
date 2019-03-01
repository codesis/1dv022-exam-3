'use strict'
// Require the game's board and bricks
const Board = require('./board')
const Brick = require('./brick')

// Function for the Memory game
function Game (element, x, y) {
  this.element = element
  this.x = x
  this.y = y
}
