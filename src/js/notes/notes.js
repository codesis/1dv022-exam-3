'use strict'

import CreateWindow from '../window.js'

function Notes (options) {
  CreateWindow.call(this, options)

  this.settingsOpen = false
  this.note = undefined
}

Notes.prototype = Object.create(CreateWindow.prototype)
Notes.prototype.constructor = Notes

// For initializing the game when the user clicks on the icon
Notes.prototype.init = function () {
  this.print()

  this.element.querySelector('.window-menu').addEventListener('click', this.menuClicked.bind(this))
}

// Prints the game to the window
Notes.prototype.print = function () {
  CreateWindow.prototype.print.call(this)
  this.element.classList.add('notes-app')

  // add the menu alternatives
  let menu = this.element.querySelector('.window-menu')
  let alt1 = document.querySelector('#template-window-menu-alternative').content.cloneNode(true)
  alt1.querySelector('.menu-alternative').appendChild(document.createTextNode('New Note'))

  let alt2 = document.querySelector('#template-window-menu-alternative').content.cloneNode(true)
  alt2.querySelector('.menu-alternative').appendChild(document.createTextNode('Settings'))

  menu.appendChild(alt1)
  menu.appendChild(alt2)

  let textArea = this.element.querySelector('.window-content')
  let areaText = document.querySelector('#template-notes-app').content.cloneNode(true)

  textArea.appendChild(areaText)
}

// For what happens when the user clicks setting or new game
Notes.prototype.menuClicked = function (event) {
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

      case 'new note': {
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

export default Notes
