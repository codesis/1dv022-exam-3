'use strict'

// Function to create the board of the memory
function Board (element, x, y) {
  this.element = element
  this.x = x
  this.y = y
}
// Print bricks to the row
Board.prototype.printBricks = function () {
  let frag = document.createDocumentFragment()
  let rowDiv
  let brickDiv

  for (let i = 0; i < this.y; i += 1) {
    rowDiv = document.createElement('div')
    rowDiv.classList.add('row')

    for (let j = 0; j < this.x; j += 1) {
      brickDiv = document.createElement('div')
      brickDiv.classList.add('brick-' + i + j, 'brick')
      rowDiv.appendChild(brickDiv)
    }
    frag.appendChild(rowDiv)
  }
  this.element.appendChild(frag)
}

module.exports = Board
