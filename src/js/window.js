'use strict'

// Function to create a basic window
function CreateWindow (options) {
  this.element = undefined
  this.x = options.x || 10
  this.y = options.y || 10
}
// Function to destroy window
CreateWindow.prototype.destroy = function () {
  document.querySelector('#main-desktop').removeChild(this.element)
}
// Function to print window
CreateWindow.prototype.print = function () {
  let template = document.querySelector('#tempWindow').textContent.cloneNode(true)
  let tempWindow = template.querySelector('div')
  tempWindow.setAttribute('id', this.id)
  tempWindow.style.left = this.x + 'px'
}
