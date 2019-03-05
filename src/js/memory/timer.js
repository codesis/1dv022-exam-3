'use strict'

/**
 * Timer constructor
 * @constructor
 */
function Timer () {
  this.startTime = undefined
}

// Starts the times
Timer.prototype.start = function () {
  this.startTime = new Date().getTime()
}

// Stops the timer
Timer.prototype.stop = function () {
  let now = new Date().getTime()

  return (now - this.startTime) / 1000
}

// Prints the times at given element
Timer.prototype.print = function (diff) {
  if (this.element.hasChildNodes()) {
    this.element.replaceChild(document.createTextNode(diff), this.element.firstChild)
  } else {
    this.element.appendChild(document.createTextNode(diff))
  }
}

export default Timer
