'use strict'
import Memory from './memory/memory.js'
import Chat from './chat/chatApplication.js'

/**
 * Constructor for the launcher
 * @param desktop, the parent Desktop object
 * @constructor
 */
function Launcher (desktop) {
  this.desktop = desktop

  // the datestampoptions to use
  this.dateStampOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }

  // the timestampoptions to use
  this.timeStampOptions = {
    hour: '2-digit', minute: '2-digit'
  }
}

/**
 * Function to initialize the basics
 */
Launcher.prototype.init = function () {
  document.querySelector('.launcher').addEventListener('click', this.launcherClick.bind(this), true)

  this.updateClock()
  window.setInterval(this.updateClock.bind(this), 1000)
}

/**
 * Function to handle the clicks in the launcher
 * @param event
 */
Launcher.prototype.launcherClick = function (event) {
  let value
  let icon
  let title

  // Get the element that got clicked
  let element = this.getClickedLauncherElement(event.target)

  if (element) {
    // get value from the element
    value = element.getAttribute('value')
  }

  if (value) {
    let switchTo = value.split(':')

    // check if the click is in the "running-apps"-section.
    if (switchTo[0] === 'id') {
      if (element.classList.contains('tooltip-close')) {
        // close pressed, close window
        this.desktop.closeWindow(switchTo[1])
      } else {
        // running-apps-tab clicked, switch to that app
        this.switchToWindow(switchTo[1])
      }
    }

    // start the app that got clicked
    else {
      icon = element.querySelector('i').textContent
      title = element.querySelector('.tooltip-title').textContent
      this.startApplication(value, icon, title)
    }
  }
}

/**
 * Function to get what element got clicked in the launcher
 * @param target - the event-target from click
 * @returns DOM-element
 */
Launcher.prototype.getClickedLauncherElement = function (target) {
  let element

  if (target.getAttribute('value')) {
    element = target
  } else if (target.parentNode.getAttribute('value')) {
    // is the i-tag in the li
    element = target.parentNode
  }

  return element
}

/**
 * Function to start new application
 * @param type - what app should be started
 * @param icon - what icon to use
 * @param title - what title to use
 */
Launcher.prototype.startApplication = function (type, icon, title) {
  let marginX = 10 * (this.desktop.offsetX)
  let marginY = 10 * (this.desktop.offsetY)

  // create the settings-object
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

  let newApp = this.createApplication(type, appOptions)

  if (newApp) {
    // add listener to the window-buttons
    let buttons = document.querySelector('#' + newApp.id + ' .window-buttons')
    buttons.addEventListener('click', this.desktop.windowButtonClick.bind(this.desktop))

    // save the object to windows-array
    this.desktop.windows.push(newApp)

    // add to the running-apps-list
    this.addRunningApp(type, newApp)

    // increase the serialnumber and such
    this.desktop.serialNumber += 1
    this.desktop.offsetX += 1
    this.desktop.offsetY += 1

    // set focus to the new app and check bounds
    this.desktop.setFocus(newApp.element)
    this.checkBounds(newApp)
  }
}

Launcher.prototype.createApplication = function (type, appOptions) {
  let newApp

  // check what app to start and start it, add eventually maximizable and keyActivated
  switch (type) {
    case 'memory':
    {
      // set setting to listen on keys
      appOptions.keyActivated = true
      newApp = new Memory(appOptions)
      newApp.init()

      break
    }

    case 'chat':
    {
      // set option to be able to maximize window
      appOptions.maximizable = true
      newApp = new Chat(appOptions)
      newApp.init()

      break
    }
    case 'reset':
    {
      // reset the desktop
      this.desktop.clearDesktop()
      break
    }
  }

  return newApp
}

/**
 * Function to handle if the new window is out of bounds
 * @param app - the app-object to be checked
 */
Launcher.prototype.checkBounds = function (app) {
  let windowW = window.innerWidth
  let windowH = window.innerHeight

  let appRight = app.x + parseInt(app.element.offsetWidth)
  let appBottom = app.y + parseInt(app.element.offsetHeight)

  // check if the app-window is out of bounds and get it into bounds
  if (appRight > windowW || app.x < 0) {
    // reset the offset
    this.desktop.offsetX = 1

    // set new positions
    app.x = 10 * (this.desktop.offsetX)
    app.element.style.left = app.x + 'px'
  } else if (appBottom > windowH || app.y < 0) {
    // reset the offset
    this.desktop.offsetY = 1

    // set new positions
    app.y = 10 * (this.desktop.offsetY)
    app.element.style.top = app.y + 'px'
  }
}

/**
 * Function to handle focus on call, and show minimized window again
 * @param id - the window-id to set focus on
 */
Launcher.prototype.switchToWindow = function (id) {
  let window = document.querySelector('#' + id)
  if (window) {
    // if minimized, show it again
    if (window.classList.contains('minimized')) {
      window.classList.remove('minimized')
    }

    // set focus
    this.desktop.setFocus(window)
  }
}

/**
 * Function to add a new app to the running-app-list
 * @param type - what type is the app (what list to add to)
 * @param app - the app-object to be added
 */
Launcher.prototype.addRunningApp = function (type, app) {
  // get the tooltip-container for the app and add it to the list
  let container = document.querySelector("li[value='" + type + "'] .tooltip-container")
  let template = document.querySelector('#template-tooltip').content.cloneNode(true)
  template.querySelector('.tooltip').appendChild(document.createTextNode(app.title + '(' + app.id + ')'))
  template.querySelector('.tooltip').setAttribute('value', 'id:' + app.id)
  template.querySelector('.tooltip-close').setAttribute('value', 'id:' + app.id)

  container.appendChild(template)
}

/**
 * Function to update the clock
 */
Launcher.prototype.updateClock = function () {
  let dateObj = new Date()
  let date = dateObj.toLocaleDateString('sv-se', this.dateStampOptions)
  let time = dateObj.toLocaleTimeString('sv-se', this.timeStampOptions)

  let timeElem = document.querySelector('.launcher-clock-time')
  let dateElem = document.querySelector('.launcher-clock-date')

  let timeNode = document.createTextNode(time)
  let dateNode = document.createTextNode(date)

  timeElem.replaceChild(timeNode, timeElem.firstChild)
  dateElem.replaceChild(dateNode, dateElem.firstChild)
}

export default Launcher
