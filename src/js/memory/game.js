'use strict'
// Require the game's board and bricks
import Board from './board.js'
import Brick from './brick.js'

// Function for the Memory game
function Game (element, x, y) {
  this.element = element
  this.x = x
  this.y = y
  this.layout = new Board(element, this.x, this.y)
  this.board = []
  this.visibleBricks = []
  this.tries = 0
  this.brickList = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
  this.images = this.brickList.slice(0, (this.x * this.y))
  this.clickFunc = this.click.bind(this)

  this.shuffleBricks()
  this.addEventListeners()
}
// initialize the game
Game.prototype.init = function () {
  let i = 0

  this.board = []

  if (this.x > this.y) {
    for (i = 0; i < this.x; i += 1) {
      this.board.push(new Array(this.y))
    }
  } else {
    for (i = 0; i < this.y; i += 1) {
      this.board.push(new Array(this.x))
    }
  }
  this.visibleBricks = []

  for (i = 0; i < this.y; i += 1) {
    for (let j = 0; j < this.x - 1; j += 2) {
      this.board[i][j] = new Brick('' + i + j, this.images.pop())
      this.board[i][j + 1] = new Brick('' + i + (j + 1), this.images.pop())
    }
  }
}
// Shuffle the bricks
Game.prototype.shuffleBricks = function () {
  let random
  let temporary
  for (let i = 0; i < this.images.length; i += 1) {
    temporary = this.images[i]
    random = Math.floor(Math.random() * this.images.length)
    this.images[i] = this.images[random]
    this.images[random] = temporary
  }
}
// Event listeners
Game.prototype.addEventListeners = function () {
  this.element.addEventListeners('click', this.clickFunc)
}
Game.prototype.removeEventListeners = function () {
  this.element.removeEventListeners('click', this.clickFunc)
}
Game.prototype.click = function (event) {
  this.turnBrick(event.target)
}
// Turning the brick
Game.prototype.turnBrick = function (element) {
  if (this.visibleBricks.length < 2 && !element.classList.contains('disable')) {
    if (element.classList.contains('brick')) {
      let xy = element.classList[0].split('-')[1]
      let x = xy.charAt(0)
      let y = xy.charAt(1)

      element.classList.add('img-' + this.board[x][y].jpegNr)
      element.classList.add('img')

      this.visibleBricks.push(this.board[x][y])

      this.element.querySelector('.brick-' + this.board[x][y].id).classList.add('disable')

      if (this.visibleBricks.length === 2) {
        this.controlIfCorrect()
      }
    }
  }
}
// Checks if the turned bricks are a pair
Game.prototype.controlIfCorrect = function () {
  this.turns += 1
  if (this.visibleBricks[0].jpegNr === this.visibleBricks[1].jpegNr) {
    this.element.querySelector('.brick-' + this.visibleBricks[0].id).classList.add('right')
    this.element.querySelector('.brick-' + this.visibleBricks[1].id).classList.add('right')

    this.visibleBricks = []

    this.correctCount += 1

    if (this.correctCount === (this.x * this.y / 2)) {
      this.gameOver()
    }
  } else {
    for (let i = 0; i < this.visibleBricks.length; i += 1) {
      this.element.querySelector('.brick-' + this.visibleBricks[i].id).classList.add('wrong')
      this.element.querySelector('.brick-' + this.visibleBricks[i].id).classList.remove('disable')
    }
    setTimeout(this.turnBackBricks.bind(this), 1500)
  }
}
// For turning back wrongful bricks
Game.prototype.turnBackBricks = function () {
  let tempBrick

  for (let i = 0; i < this.visibleBricks.length; i += 1) {
    tempBrick = this.visibleBricks[i]
    this.element.querySelector('.brick-' + tempBrick.id).classList.remove('wrong', 'img', 'img-' + tempBrick.jpegNr)
  }
  this.visibleBricks = []
}
// For when the game is completed
Game.prototype.gameOver = function () {
  let template = document.querySelector('#tempMemoryGameOver').content.cloneNode(true)
  template.querySelector('.memoryTurns').appendChild(document.createTextNode(this.turns))

  this.element.appendChild(template)
}

export default Game
