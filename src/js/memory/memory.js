'use strict'

import CreateWindow from './../window.js'
import Game from './game.js'

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
// Setting up starting view of memory game
Memory.prototype.print = function () {
  CreateWindow.prototype.print.call(this)
  this.element.classList.add('memoryApp')

  let menu = this.element.querySelector('.window-menu')
  let alt1 = document.querySelector('#tempWindowAlt').content.cloneNode(true)
  alt1.querySelector('.menu-alt').appendChild(document.createTextNode('Start a new game'))
  let alt2 = document.querySelector('#tempWindowAlt').content.cloneNode(true)
  alt2.querySelector('.menu-alt').appendChild(document.createTextNode('Settings'))
  menu.appendChild(alt1)
  menu.appendChild(alt2)
}
Memory.prototype.menuClicked = function (event) {
  let target
  if (event.target.tagName.toLowerCase() === 'a') {
    target = event.target.textContent.toLowerCase()
  }
  if (target) {
    switch (target) {
      case 'settings': {
        this.menuSettings()
        break
      }
      case 'new game': {
        if (this.settingsOpen) {
          this.settingsOpen = false
        }
        this.restart()
        break
      }
    }
  }
}
Memory.prototype.restart = function (value) {
  if (value) {
    this.boardSize = value.split('x')
  }
  let x = this.boardSize[0]
  let y = this.boardSize[1]
  this.clearContent()
  this.game.removeEventListeners()
  this.game = new Game(this.element.querySelector('.window-content'), x, y)
  this.game.init()
}

// Memory.prototype = Object.create(prototype)
// Memory.prototype.constructor = Memory

export default Memory
