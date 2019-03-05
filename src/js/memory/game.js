'use strict'

import Board from './board.js'
import Card from './brick.js'
import Timer from './timer.js'

/**
 * @param element - element to print to
 * @param x - amount of columns
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
  this.imageList = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
  this.images = this.imageList.slice(0, (this.y * this.x))
  this.clickFunc = this.click.bind(this)

  // start new timer when the game begins (right away)
  this.timer = new Timer()
  this.timer.start()

  this.totalTime = 0

  // shuffle and add event listeners
  this.shuffleImages()
  this.addEvents()
}

// Start the game
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

  this.visibleCards = []

  // puts the cards into the game board
  for (i = 0; i < this.y; i += 1) {
    for (let j = 0; j < this.x - 1; j += 2) {
      this.board[i][j] = new Card('' + i + j, this.images.pop())
      this.board[i][j + 1] = new Card('' + i + (j + 1), this.images.pop())
    }
  }
}

// Shuffles the images in the memory game
Game.prototype.shuffleImages = function () {
  let temp
  let rand
  for (let i = 0; i < this.images.length; i += 1) {
    temp = this.images[i]
    rand = Math.floor(Math.random() * this.images.length)
    this.images[i] = this.images[rand]
    this.images[rand] = temp
  }
}

// Adding event listener
Game.prototype.addEvents = function () {
  this.element.addEventListener('click', this.clickFunc)
}

// Removing event listener
Game.prototype.removeEvents = function () {
  this.element.removeEventListener('click', this.clickFunc)
}

// Function for when the user clicks
Game.prototype.click = function (event) {
  this.turnCard(event.target)
}

// For when a brick/card is clicked, it will turn
Game.prototype.turnCard = function (element) {
  if (this.visibleCards.length < 2 && !element.classList.contains('disable')) {
    if (element.classList.contains('card')) {
      let yx = element.classList[0].split('-')[1]
      let y = yx.charAt(0)
      let x = yx.charAt(1)

      // add classes to show the card
      element.classList.add('img-' + this.board[y][x].imgNr)
      element.classList.add('img')

      this.visibleCards.push(this.board[y][x])

      // disable the card that got clicked
      this.element.querySelector('.card-' + this.board[y][x].id).classList.add('disable')

      if (this.visibleCards.length === 2) {
        // check if the pair are matching
        this.checkIfCorrect()
      }
    }
  }
}

// Checks if the two bricks/cards are a matching pair
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
      // the game is over since the correct count is the amount of cards
      this.gameOver()
    }
  } else {
    // it was not correct, set the classes
    for (let i = 0; i < this.visibleCards.length; i += 1) {
      this.element.querySelector('.card-' + this.visibleCards[i].id).classList.add('wrong')
      this.element.querySelector('.card-' + this.visibleCards[i].id).classList.remove('disable')
    }

    // turn back the cards
    setTimeout(this.turnBackCards.bind(this), 700)
  }
}

// For when the two bricks are not a matching pair
Game.prototype.turnBackCards = function () {
  let tempCard
  for (let i = 0; i < this.visibleCards.length; i += 1) {
    tempCard = this.visibleCards[i]
    this.element.querySelector('.card-' + tempCard.id).classList.remove('wrong', 'img', 'img-' + tempCard.imgNr)
  }

  // reset the array
  this.visibleCards = []
}

// For when the user has completed the game
Game.prototype.gameOver = function () {
  this.totalTime = this.timer.stop()
  let template = document.querySelector('#template-memory-gameover').content.cloneNode(true)
  template.querySelector('.memory-turns').appendChild(document.createTextNode(this.turns))
  template.querySelector('.memory-time').appendChild(document.createTextNode(this.totalTime))

  this.element.appendChild(template)
}

export default Game
