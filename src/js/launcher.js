'use strict'

import Memory from './memory/memory.js'

class Launcher {
  constructor (desktop) {
    this.desktop = desktop
  }
  init () {
    document.querySelector('.launcher').addEventListener('click', this.launcherClick.bind(this))
  }
  launcherClick (event) {
    let title
    let value
    let icon

    let element = this.getClickedLauncherElement(event.target)

    if (element) {
      value = element.getAttribute('value')
    }
    if (value) {
      let switchTo = value.split(':')

      if (switchTo[0] === 'id') {
        if (element.classList.contains('exit-cross')) {
          this.desktop.closeWindow(switchTo[1])
        } else {
          this.switchToWindow(switchTo[1])
        }
      } else {
        icon = element.querySelector('i').textContent
        title = element.querySelector('.app-title').textContent
        this.startApp(title, value, icon)
      }
    }
  }
  getClickedLauncherElement (target) {
    let element
    if (target.getAttribute('value')) {
      element = target
    } else if (target.parentNode.getAttribute('value')) {
      element = target.parentNode
    }
    return element
  }
  startApp (type, icon, title) {
    let marginX = 10 * (this.desktop.offsetX)
    let marginY = 10 * (this.desktop.offsetY)
    let options = {
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
    let newApp = this.createApplication(type, options)
    if (newApp) {
      let buttons = document.querySelector('#' + newApp.id + ' .window-buttons')
      buttons.addEventListener('click', this.desktop.clickWindowBtn.bind(this.desktop))
      this.desktop.windows.push(newApp)
      this.addRunningApp(type, newApp)
      this.desktop.serialNumber += 1
      this.desktop.offsetX += 1
      this.desktop.offsetY += 1
      this.desktop.setFocus(newApp.element)
      this.checkBounds(newApp)
    }
  }
  createApplication (type, options) {
    let newApp
    switch (type) {
      case 'memory': {
        options.keyActivated = true
        newApp = new Memory(options)
        newApp.init()
        break
      }
      case 'reset': {
        this.desktop.clearDesktop()
        break
      }
    }
    return newApp
  }
  checkBounds (app) {
    let winWidth = window.innerWidth
    let winHeight = window.innerHeight
    let appRight = app.x + parseInt(app.element.offsetWidth)
    let appBottom = app.y + parseInt(app.element.offsetHeight)
    if (appRight > winWidth || app.x < 0) {
      this.desktop.offsetX = 1
      app.x = 10 * (this.desktop.offsetX)
      app.element.style.left = app.x + 'px'
    } else if (appBottom > winHeight || app.y < 0) {
      this.desktop.offsetY = 1
      app.y = 10 * (this.desktop.offsetY)
      app.element.style.top = app.y + 'px'
    }
  }
  switchToWindow (id) {
    let window = document.querySelector('#' + id)
    if (window) {
      if (window.classList.contains('minimized')) {
        window.classList.remove('minimized')
      }
      this.desktop.setFocus(window)
    }
  }
}

export default Launcher
