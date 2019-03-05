'use strict'

import CreateWindow from '../window.js'
// The function for the about application
function Notes (id, x, y) {
  CreateWindow.call(this, id, x, y)
}

Notes.prototype = Object.create(CreateWindow.prototype)
Notes.prototype.constructor = Notes

Notes.prototype.print = function () {
  CreateWindow.prototype.print.call(this)
  this.element.classList.add('about-app')

  let template = document.querySelector('#template-about').content.cloneNode(true)
  this.element.querySelector('.window-content').appendChild(template)
}

export default Notes
