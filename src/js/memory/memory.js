'use strict'

const CreateWindow = require('./../window')
const Game = require('./game')

function Memory (options) {
  CreateWindow.call(this, options)

  this.settingsOpen = false
  this.game = undefined
  this.boardSize = [4, 4]
  this.markedBrick = undefined
}
Memory.prototype = Object.create(CreateWindow.prototype)
Memory.prototype.constructor = Memory

// Initialize memory
Memory.prototype.init = function () {
  this.print()
  this.element.querySelector('.window-menu').addEventListener('click', this.menuClicked.bind(this))

  this.game = new Game(this.element.querySelector('.window-content'), 4, 4)
  this.game.init()
}
