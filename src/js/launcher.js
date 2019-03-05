'use strict'
import Memory from './memory/game.js'

function Launcher (desktop) {
  this.desktop = desktop
}
Launcher.prototype.init = function () {
  document.querySelector('.launcher').addEventListener('click', this.startApp())
}
Launcher.prototype.startApp = function (type, icon, title) {
  let marginX = 10 * (this.desktop.offsetX)
  let marginY = 10 * (this.desktop.offsetY)

  let appOptions = {
    id: 'win-' + this.desktop.serialNumber,
    x: marginX,
    y: marginY,
    tabIndex: this.desktop.serialNumber,
    zIndex: this.desktop.zIndex,
    icon: icon,
    title: title,
    maximizable: false,
    keyActivated: false
  }
  let newApp = this.createApp(type, appOptions)

  if (newApp) {
    let buttons = document.querySelector('#', newApp.id + ' .window-buttons')
    buttons.addEventListener('click', this.desktop.windowBtnClick.bind(this.desktop))

    this.desktop.windows.push(newApp)

    this.desktop.serialNumber += 1
    this.desktop.offsetX += 1
    this.desktop.offsetY += 1

    this.desktop.setFocus(newApp.element)
    this.checkBounds(newApp)
  }
}
Launcher.prototype.createApp = function (type, appOptions) {
  let newApp

  switch (type) {
    case 'memory': {
      appOptions.keyActivated = true
      newApp = new Memory(appOptions)
      newApp.init()

      break
    }
  }
  return newApp
}
Launcher.prototype.checkBounds = function (app) {
  let winWidth = window.innerWidth
  let winHeigth = window.innerHeight

  let appRight = app.x + parseInt(app.element.offsetWidth)
  let appBottom = app.y + parseInt(app.element.offsetHeight)

  if (appRight > winWidth || app.x < 0) {
    this.desktop.offsetX = 1

    app.x = 10 * (this.desktop.offsetX)
    app.element.style.left = app.x + 'px'
  } else if (appBottom > winHeigth || app.y < 0) {
    this.desktop.offsetY = 1

    app.y = 10 * (this.desktop.offsetY)
    app.element.style.top = app.y + 'px'
  }
}
export default Launcher
