'use strict'
import CreateWindow from '../window.js'
import Chat from './chat.js'

/**
 * Constructor function for the chat app
 * @param options - the settings-object
 * @constructor
 */
function ChatApp (options) {
  CreateWindow.call(this, options)
  this.chat = undefined
  this.settingsOpen = false
  this.username = ''
  this.server = 'ws://vhost3.lnu.se:20080/socket/'

  this.addFocusFunc = this.addFocus.bind(this)
  this.removeFocusFunc = this.removeFocus.bind(this)
}

ChatApp.prototype = Object.create(CreateWindow.prototype)
ChatApp.prototype.constructor = ChatApp

/**
 * Function to init the Creates
 */
ChatApp.prototype.init = function () {
  if (window.localStorage.getItem('username')) {
    this.username = window.localStorage.getItem('username')
  }

  this.print()

  // add listener to the menu
  this.element.querySelector('.window-menu').addEventListener('click', this.menuClicked.bind(this))
}

/**
 * Function to print the app
 */
ChatApp.prototype.print = function () {
  CreateWindow.prototype.print.call(this)

  this.element.classList.add('chat-app')
  this.element.querySelector('.window-icon').classList.add('chat-offline')

  // add the menu
  var menu = this.element.querySelector('.window-menu')
  var alt = document.querySelector('#template-window-menu-alternative').content
  var alt1 = alt.cloneNode(true)
  alt1.querySelector('.menu-alternative').appendChild(document.createTextNode('Clear History'))

  var alt2 = alt.cloneNode(true)
  alt2.querySelector('.menu-alternative').appendChild(document.createTextNode('Settings'))

  menu.appendChild(alt1)
  menu.appendChild(alt2)

  // print the settings
  this.menuSettings()
}

/**
 * Function to destroy the app
 */
ChatApp.prototype.destroy = function () {
  if (this.chat) {
    this.chat.socket.close()
  }

  document.querySelector('#main-frame').removeChild(this.element)
}

/**
 * Function to handle the menu-click
 * @param event
 */
ChatApp.prototype.menuClicked = function (event) {
  var target
  if (event.target.tagName.toLowerCase() === 'a') {
    // get the target text and make it lower case
    target = event.target.textContent.toLowerCase()
  }

  if (target) {
    switch (target) {
      // make the correct call
      case 'settings': {
        this.menuSettings()
        break
      }

      case 'clear history': {
        if (this.chat) {
          this.chat.clearHistory()
        }

        break
      }
    }
  }
}

/**
 * Function to show the settings
 */
ChatApp.prototype.menuSettings = function () {
  var i
  var inputList

  if (!this.settingsOpen) {
    // show the settings
    var template = document.querySelector('#template-settings').content.cloneNode(true)
    template.querySelector('.settings').classList.add('chat-settings')

    // get the settings
    template = this.addSettings(template)

    inputList = template.querySelectorAll("input[type='text']")

    for (i = 0; i < inputList.length; i += 1) {
      inputList[i].addEventListener('focus', this.addFocusFunc)
      inputList[i].addEventListener('focusout', this.removeFocusFunc)
    }

    // append it
    this.element.querySelector('.window-content').appendChild(template)
    this.settingsOpen = true
  } else {
    // settings showing. close the settings
    var settings = this.element.querySelector('.settings-wrapper')
    this.element.querySelector('.window-content').removeChild(settings)
    this.settingsOpen = false
  }
}

/**
 * Function to add the settings
 * @param element - the element to append to
 * @returns {*} - the element
 */
ChatApp.prototype.addSettings = function (element) {
  var template = document.querySelector('#template-chat-settings').content.cloneNode(true)

  template.querySelector("input[name='username']").setAttribute('value', this.username)
  template.querySelector("input[name='server']").setAttribute('value', this.server)

  template.querySelector("input[type='button']").addEventListener('click', this.saveSettings.bind(this))

  element.querySelector('.settings').appendChild(template)
  return element
}

/**
 * Function to save the settings and reopen chat with them
 */
ChatApp.prototype.saveSettings = function () {
  // close the chat-connection
  if (this.chat) {
    this.chat.socket.close()
    this.chat.online = false
  }

  var form = this.element.querySelector('.settings-form')

  // get the values from settings-form
  this.username = form.querySelector("input[name='username']").value
  this.server = form.querySelector("input[name='server']").value

  // show offline to the user
  this.element.querySelector('.window-icon').classList.remove('chat-online', 'chat-connecting', 'chat-offline')
  this.element.querySelector('.window-icon').classList.add('chat-offline')

  this.clearContent()

  // start the new chat
  if (this.username === '') {
    this.username = 'User'
  }

  // start the new chat
  this.chat = new Chat(this.element, this.server, this.username)
  this.chat.init()
  this.settingsOpen = false
  this.setFocus()

  // save the username to storage
  window.localStorage.setItem('username', this.username)
}

/**
 * Function to add focus to the window
 */
ChatApp.prototype.addFocus = function () {
  if (!this.element.classList.contains('focused-window')) {
    this.element.classList.add('focused-window')
  }
}

/**
 * Function to remove focus from window
 */
ChatApp.prototype.removeFocus = function () {
  if (this.element.classList.contains('focused-window')) {
    this.element.classList.remove('focused-window')
  }
}

/**
 * Function to set focus
 */
ChatApp.prototype.setFocus = function () {
  this.element.classList.remove('focused-window')
  this.element.focus()
}

export default ChatApp
