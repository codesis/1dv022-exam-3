'use strict'

import Launcher from './launcher.js'

class Desktop {
  constructor () {
    this.activeWindow = false
    this.mouseMoveFunc = this.mouseMove.bind(this)
    this.mouseUpFunc = this.mouseUp.bind(this)
    this.windows = []
    this.offSetX = 1
    this.offSetY = 1
    this.zIndex = 0
    this.clickX = 0
    this.clickY = 0
    this.launcher = new Launcher(this)
  }
  // Initialize the desktop
  init () {
    this.launcher.init()
    document.addEventListener('mousedown', this.mouseDown.bind(this))
  }
  // When the mousebtn is released
  mouseUp () {
    window.removeEventListener('mousemove', this.mouseMoveFunc)
    window.removeEventListener('mouseup', this.mouseUpFunc)
    this.activeWindow.element.classList.remove('moving')
  }
  // When the mousebtn is pressed
  mouseDown (event) {
    let element = event.target

    if (element.parentNode.classList) {
      while (!element.parentNode.classList.contains('main-desktop')) {
        element = element.parentNode
      }
    }
    if (element.classList.contains('window')) {
      if (parseInt(element.style.zIndex) !== this.zIndex) {
        this.setFocus(element)
      }
      if (event.target.classList.contains('window-top')) {
        if (!event.target.parentNode.classList.contains('maximized')) {
          this.clickX = event.clientX - this.activeWindow.x
          this.clickY = event.clientY - this.activeWindow.y
          element.classList.add('moving')

          window.addEventListener('mousemove', this.mouseMove)
          window.addEventListener('mouseup', this.mouseUp)
        }
      }
    }
  }
  // When the mouse is moved
  mouseMove (event) {
    let newX = event.clientX - this.clickX
    let newY = event.clientY - this.clickY

    let newMidX = newX + parseInt(this.activeWindow.element.offsetWidth) / 2
    let newMidY = newY + parseInt(this.activeWindow.element.offsetHeigth) / 2

    let winWidth = window.innerWidth
    let winHeigth = window.innerHeight

    if (newMidX < winWidth && newMidX > 0 && newMidY < winHeigth && newY > 0) {
      this.activeWindow.x = event.clientX - this.clickX
      this.activeWindow.y = event.clickY - this.clickY

      this.activeWindow.element.classList.remove('reset-window')
      this.activeWindow.element.style.left = this.activeWindow.x + 'px'
      this.activeWindow.element.style.tope = this.activeWindow.y + 'px'
    }
  }

  // When an icon/btn is clicked
  clickBtn (event) {
    let action = event.target.classList
    let element = event.target

    if (element.parentNode) {
      while (!element.parentNode.id) {
        element = element.parentNode
      }
      element = element.parentNode
    }
    let index = -1
    for (let i = 0; i < this.windows.length; i += 1) {
      if (this.windows[i].id === element.id) {
        index = i
      }
    }
    if (index !== -1) {
      this.setFocus(this.windows[index].element)
      if (action.contains('exit-btn')) {
        this.closeWindow(this.windows[index].id)
      } else if (action.contains('minimize-btn')) {
        this.windows[index].minimize()
      } else if (action.contains('maximize-btn')) {
        if (this.windows[index].maximizable) {
          this.windows[index].maximize()
        }
      }
    }
  }
//   closeWindow (id) {
//     let removed = false
//     for (let i = 0; i < this.windows.length && !removed; i += 1) {
//       if (this.windows[i].id === id) {
//       }
//     }
//   }
}
export default Desktop
