'use strict'

import Board from './board.js'
import Card from './brick.js'
import Timer from './timer.js'

/**
 * Constructorfunction for the game
 * @param element - element to print to
 * @param x - amount of cols
 * @param y - amount of rows
 * @constructor
 */
function Game (element, x, y) {
  this.element = element
  this.x = parseInt(x)
  this.y = parseInt(y)
  this.layout = new Board(element, this.x, this.y)
  this.board = []
  this.visibleCards = []
  this.turns = 0
  this.correctCount = 0
  this.imageList = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]
  this.images = this.imageList.slice(0, (this.y * this.x))
  this.clickFunc = this.click.bind(this)

  // start new timer
  this.timer = new Timer()
  this.timer.start()

  this.totalTime = 0

  // shuffle and add eventlisteners
  this.shuffleImages()
  this.addEvents()
}

/**
 * Init the game
 */
Game.prototype.init = function () {
  var i = 0

  // init the empty board-array
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

  this.visibleCards = []

  // push new cards to the board-array
  for (i = 0; i < this.y; i += 1) {
    for (var j = 0; j < this.x - 1; j += 2) {
      this.board[i][j] = new Card('' + i + j, this.images.pop())
      this.board[i][j + 1] = new Card('' + i + (j + 1), this.images.pop())
    }
  }
}

// Function to shuffle the images-array
Game.prototype.shuffleImages = function () {
  var temp
  var rand
  for (var i = 0; i < this.images.length; i += 1) {
    temp = this.images[i]
    rand = Math.floor(Math.random() * this.images.length)
    this.images[i] = this.images[rand]
    this.images[rand] = temp
  }
}

/**
 * Function to add the events needed
 */
Game.prototype.addEvents = function () {
  this.element.addEventListener('click', this.clickFunc)
}

/**
 * Function to remove the events
 */
Game.prototype.removeEvents = function () {
  this.element.removeEventListener('click', this.clickFunc)
}

/**
 * Function to handle the clicks
 * @param event - the click-event
 */
Game.prototype.click = function (event) {
  this.turnCard(event.target)
}

/**
 * Function to turn the given carde
 * @param element - the card to turn
 */
Game.prototype.turnCard = function (element) {
  if (this.visibleCards.length < 2 && !element.classList.contains('disable')) {
    if (element.classList.contains('card')) {
      var yx = element.classList[0].split('-')[1]
      var y = yx.charAt(0)
      var x = yx.charAt(1)

      // add classes to show the card
      element.classList.add('img-' + this.board[y][x].imgNr)
      element.classList.add('img')

      this.visibleCards.push(this.board[y][x])

      // disable the card that got clicked
      this.element.querySelector('.card-' + this.board[y][x].id).classList.add('disable')

      if (this.visibleCards.length === 2) {
        // check fi the pair is the same
        this.checkIfCorrect()
      }
    }
  }
}

/**
 * Function to check if the pair is the same
 */
Game.prototype.checkIfCorrect = function () {
  this.turns += 1
  if (this.visibleCards[0].imgNr === this.visibleCards[1].imgNr) {
    // it was the same image, show it to the user
    this.element.querySelector('.card-' + this.visibleCards[0].id).classList.add('right')
    this.element.querySelector('.card-' + this.visibleCards[1].id).classList.add('right')

    // reset the visible-cards array
    this.visibleCards = []

    this.correctCount += 1

    if (this.correctCount === (this.x * this.y / 2)) {
      // the game is over since the correctcount is the amount of cards
      this.gameOver()
    }
  } else {
    // it was not correct, set the classes
    for (var i = 0; i < this.visibleCards.length; i += 1) {
      this.element.querySelector('.card-' + this.visibleCards[i].id).classList.add('wrong')
      this.element.querySelector('.card-' + this.visibleCards[i].id).classList.remove('disable')
    }

    // turn back the cards
    setTimeout(this.turnBackCards.bind(this), 1000)
  }
}

/**
 * Function to turn back cards when wrong
 */
Game.prototype.turnBackCards = function () {
  var tempCard
  for (var i = 0; i < this.visibleCards.length; i += 1) {
    tempCard = this.visibleCards[i]
    this.element.querySelector('.card-' + tempCard.id).classList.remove('wrong', 'img', 'img-' + tempCard.imgNr)
  }

  // reset the array
  this.visibleCards = []
}

/**
 * Function to show the game over
 */
Game.prototype.gameOver = function () {
  this.totalTime = this.timer.stop()
  var template = document.querySelector('#template--gameover').content.cloneNode(true)
  template.querySelector('.-turns').appendChild(document.createTextNode(this.turns))
  template.querySelector('.-time').appendChild(document.createTextNode(this.totalTime))

  this.element.appendChild(template)
}

export default Game
