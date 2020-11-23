'use strict'

/**
 * @param options, object with the settings
 * @constructor
 */
function CreateWindow (options) {
  this.id = options.id || '' + new Date().getTime()
  this.element = undefined
  this.x = options.x || 10
  this.y = options.y || 10
  this.tabIndex = options.tabIndex || 0
  this.title = options.title || this.id
  this.icon = options.icon
  this.maximizable = options.maximizable || false
  this.keyActivated = options.keyActivated || false
  this.zIndex = options.zIndex
}

// Remove/destroy the window
CreateWindow.prototype.destroy = function () {
  document.querySelector('#main-frame').removeChild(this.element)
}

// Print the window
CreateWindow.prototype.print = function () {
  // get the template and modify it to the params
  const template = document
    .querySelector('#template-window')
    .content.cloneNode(true)
  const templateWindow = template.querySelector('div')
  templateWindow.setAttribute('id', this.id)
  templateWindow.style.left = this.x + 'px'
  templateWindow.style.top = this.y + 'px'
  templateWindow.style.zIndex = this.zIndex
  templateWindow.setAttribute('tabindex', this.tabIndex)

  // insert the new window before launcher in the DOM
  const element = document.querySelector('#main-frame')
  const launcher = document.querySelector('.launcher')
  element.insertBefore(template, launcher)

  // save the element to the object
  this.element = document.querySelector('#' + this.id)

  // add title and icon to the window (Issue with the icon not being added!)
  this.element
    .querySelector('.window-title')
    .appendChild(document.createTextNode(this.title))
  this.element
    .querySelector('.window-icon')
    .appendChild(document.createTextNode(this.icon))

  // add maximize-button
  if (this.maximizable) {
    const button = document
      .querySelector('#template-maximize-button')
      .content.cloneNode(true)
    const windowButtons = this.element.querySelector('.window-buttons')
    const removeButton = this.element.querySelector('.minimize-button')
    windowButtons.insertBefore(button, removeButton)
  }
}

// Minimize a window
CreateWindow.prototype.minimize = function () {
  this.element.classList.toggle('minimized')
}

// Maximize a window
CreateWindow.prototype.maximize = function () {
  this.element.classList.toggle('maximized')

  if (!this.element.classList.contains('maximized')) {
    this.element.classList.add('reset-window')
    this.element.style.left = this.x + 'px'
    this.element.style.top = this.y + 'px'
    this.element
      .querySelector('.maximize-button')
      .setAttribute('title', 'Maximize')
  } else {
    this.element.classList.remove('reset-window')
    this.element.style.top = '0px'
    this.element.style.left = '0px'
    this.element
      .querySelector('.maximize-button')
      .setAttribute('title', 'Resize')
  }
}

CreateWindow.prototype.clearContent = function () {
  const content = this.element.querySelector('.window-content')
  while (content.hasChildNodes()) {
    content.removeChild(content.firstChild)
  }
}

export default CreateWindow
