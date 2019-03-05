'use strict'
import CreateWindow from '../window.js'
import Game from './game.js'

/**
 * @param options - the settings (no of columns&rows)
 * @constructor
 */
function Memory (options) {
  CreateWindow.call(this, options)

  this.settingsOpen = false
  this.game = undefined
  this.boardSize = [4, 4]
  this.markedCard = undefined
}

Memory.prototype = Object.create(CreateWindow.prototype)
Memory.prototype.constructor = Memory

// For initializing the game when the user clicks on the icon
Memory.prototype.init = function () {
  this.print()

  this.element.querySelector('.window-menu').addEventListener('click', this.menuClicked.bind(this))

  this.game = new Game(this.element.querySelector('.window-content'), 4, 4)
  this.game.init()
}

// Prints the game to the window
Memory.prototype.print = function () {
  CreateWindow.prototype.print.call(this)
  this.element.classList.add('memory-app')

  // add the menu alternatives
  let menu = this.element.querySelector('.window-menu')
  let alt1 = document.querySelector('#template-window-menu-alternative').content.cloneNode(true)
  alt1.querySelector('.menu-alternative').appendChild(document.createTextNode('New Game'))

  let alt2 = document.querySelector('#template-window-menu-alternative').content.cloneNode(true)
  alt2.querySelector('.menu-alternative').appendChild(document.createTextNode('Settings'))

  menu.appendChild(alt1)
  menu.appendChild(alt2)
}

// For what happens when the user clicks setting or new game
Memory.prototype.menuClicked = function (event) {
  let target
  if (event.target.tagName.toLowerCase() === 'a') {
    target = event.target.textContent.toLowerCase()
  }

  // check what was clicked
  if (target) {
    switch (target) {
      case 'settings': {
        // open the settings
        this.menuSettings()
        break
      }

      case 'new game': {
        if (this.settingsOpen) {
          // hide the settings
          this.settingsOpen = false
        }

        // restart new game
        this.restart()
        break
      }
    }
  }
}

// For what happens when the user clicks restart
Memory.prototype.restart = function (value) {
  // split value to get x/y
  if (value) {
    this.boardSize = value.split('x')
  }

  // find y and x from split
  let y = this.boardSize[1]
  let x = this.boardSize[0]

  // clear the content
  this.clearContent()

  // remove old eventhandlers
  this.game.removeEvents()

  // create new game and init it
  this.game = new Game(this.element.querySelector('.window-content'), x, y)
  this.game.init()
}

// For when the user clicks on settings
Memory.prototype.menuSettings = function () {
  if (!this.settingsOpen) {
    // show the settings
    let template = document.querySelector('#template-settings').content.cloneNode(true)
    template.querySelector('.settings').classList.add('memory-settings')

    template = this.addSettings(template)
    this.element.querySelector('.window-content').appendChild(template)
    this.settingsOpen = true
  } else {
    // hide the settings
    let settings = this.element.querySelector('.settings-wrapper')
    this.element.querySelector('.window-content').removeChild(settings)
    this.settingsOpen = false
  }
}

// Adds the setting the user has chosen (4x4 is default choice)
Memory.prototype.addSettings = function (element) {
  let template = document.querySelector('#template-memory-settings').content.cloneNode(true)

  element.querySelector('.settings').appendChild(template)
  element.querySelector("input[type='button']").addEventListener('click', this.saveSettings.bind(this))
  return element
}

// Starts a new game with the new settings
Memory.prototype.saveSettings = function () {
  let value = this.element.querySelector("select[name='board-size']").value

  // restart with the new settings
  this.restart(value)
  this.settingsOpen = false
}

// If the user uses the keyboard (arrows)
Memory.prototype.keyInput = function (key) {
  if (!this.markedCard) {
    // no card is marked, mark the top left
    this.markedCard = this.element.querySelector('.card')
    this.markedCard.classList.add('marked')
  } else {
    // toogle the markedCard before changing markedCard
    this.markedCard.classList.toggle('marked')
    switch (key) {
      case 39: {
        this.keyRight()
        break
      }

      case 37: {
        this.keyLeft()
        break
      }

      case 38: {
        this.keyUp()
        break
      }

      case 40: {
        this.keyDown()
        break
      }

      case 13: {
        // enter . turn the marked card
        this.game.turnCard(this.markedCard)
        break
      }
    }

    this.markedCard.classList.toggle('marked')
  }
}

// For when the right arrow key is used
Memory.prototype.keyRight = function () {
  // find next card
  if (this.markedCard.nextElementSibling) {
    this.markedCard = this.markedCard.nextElementSibling
  } else {
    if (this.markedCard.parentNode.nextElementSibling) {
      this.markedCard = this.markedCard.parentNode.nextElementSibling.firstElementChild
    } else {
      // restart from top
      this.markedCard = this.element.querySelector('.card')
    }
  }
}

// For when the left key is used
Memory.prototype.keyLeft = function () {
  // find previous card
  if (this.markedCard.previousElementSibling) {
    this.markedCard = this.markedCard.previousElementSibling
  } else {
    if (this.markedCard.parentNode.previousElementSibling) {
      this.markedCard = this.markedCard.parentNode.previousElementSibling.lastElementChild
    } else {
      // restart from bottom right
      let rows = this.element.querySelectorAll('.row')
      let lastRow = rows[rows.length - 1]
      this.markedCard = lastRow.lastElementChild
    }
  }
}

// For key up
Memory.prototype.keyUp = function () {
  // find next row and card
  let rowY

  if (this.markedCard.parentNode.previousElementSibling) {
    let id = this.markedCard.classList[0].slice(-2)
    rowY = parseInt(id.charAt(0)) - 1
  } else {
    // begin from bottom
    let rows = this.element.querySelectorAll('.row')
    rowY = rows.length - 1
  }

  // find what x-position in the row the marked card is on
  let cardX = this.markedCard.classList[0].slice(-1)
  this.markedCard = this.element.querySelector('.card-' + rowY + cardX)
}

// For key down
Memory.prototype.keyDown = function () {
  // find next row and card
  let rowY

  if (this.markedCard.parentNode.nextElementSibling) {
    let id = this.markedCard.classList[0].slice(-2)
    rowY = parseInt(id.charAt(0)) + 1
  } else {
    rowY = 0
  }

  // find what x-position in the row the marked card is on
  let cardX = this.markedCard.classList[0].slice(-1)
  this.markedCard = this.element.querySelector('.card-' + rowY + cardX)
}

export default Memory
