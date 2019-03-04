'use strict'

// Function to create a basic window
function CreateWindow (options) {
  this.id = options.id
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
  tempWindow.style.top = this.y + 'px'

  let element = document.querySelector('#main-desktop')
  let launcher = document.querySelector('.launcher')
  element.insertBefore(template, launcher)

  this.element = document.querySelector('#' + this.id)
  this.element.querySelector('.window-title').appendChild(document.createTextNode(this.title))
  this.element.querySelector('.window-icon').appendChild(document.createTextNode(this.icon))

  if (this.maximizable) {
    let button = document.querySelector('#tempMaximizeBtn').content.cloneNode(true)
    let windowButtons = this.element.querySelector('.window-buttons')
    let removeButton = this.element.querySelector('.minimize-btn')
    windowButtons.insertBefore(button, removeButton)
  }
}
// Clearing the window of content
CreateWindow.prototype.clearContent = function () {
  let content = this.element.querySelector('.window-content')

  while (content.hasChildNodes()) {
    content.removeChild(content.firstChild)
  }
}
export default CreateWindow
