'use strict'

const Launcher = require('./launcher')

function Desktop () {
  this.activeWindow = false
  this.mouseMovable = this.mouseMove.bind(this)
  this.mouseUpFunc = this.mouseUp.bind(this)
  this.windows = []
  this.launcher = new Launcher(this)
}
// Initialize the desktop
Desktop.prototype.init = function () {
  this.launcher.init()

  document.addEventListener('mousedown', this.mouseDown.bind(this))
  document.addEventListener('keydown', this.keyDown.bind(this))
}
// When the mouse is released
Desktop.prototype.mouseUp = function () {

}
// When the mouse is pressed
Desktop.prototype.mouseDown = function (event) {

}
// When the mouse is moved
Desktop.prototype.mouseMove = function (event) {

}
// When an icon/btn is clicked
