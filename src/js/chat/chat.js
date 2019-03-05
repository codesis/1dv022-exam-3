'use strict'

/**
 * @param element - the element to print to
 * @param server - the server
 * @param channel - the channel, default empty
 * @param username - username
 * @constructor
 */
function Chat (element, server, channel, username) {
  this.element = element
  this.server = server
  this.channel = channel || ''
  this.username = username || ''
  this.socket = 'ws://vhost3.lnu.se:20080/socket/'
  this.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  this.online = false
  this.messages = []

  // the timestamp options to use
  this.timeStampOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
}

// Initializing the basics for the application
Chat.prototype.init = function () {
  this.print()

  // get the stored messages
  this.readStoredMessages()

  // connect
  this.connectToServer()

  // add listeners
  this.socket.addEventListener('message', this.newMessageFromServer.bind(this))
  this.element.querySelector('.chat-sendButton').addEventListener('click', this.formSubmit.bind(this))
  this.element.querySelector('form').addEventListener('submit', this.formSubmit.bind(this))
  this.element.querySelector('form').addEventListener('focusout', this.toggleFocus.bind(this))
  this.element.querySelector('.chat-inputField').addEventListener('focus', this.toggleFocus.bind(this))
  this.element.querySelector('.chat-inputField').addEventListener('input', this.checkInput.bind(this))
  this.element.querySelector('.chat-sendButton').addEventListener('focus', this.toggleFocus.bind(this))
}

// Printing the chat application
Chat.prototype.print = function () {
  // print the chat-template to this.element
  let template = document.querySelector('#template-chat-app').content.cloneNode(true)
  this.element.querySelector('.window-content').appendChild(template)

  // print info
  let info = document.querySelector('#template-window-menu-info').content.cloneNode(true)
  let channelInfo = ''

  // handle the channels
  if (this.channel === '') {
    channelInfo = 'Non-specified'
  } else {
    channelInfo = this.channel
  }

  // show info
  let infoNode = document.createTextNode('#' + channelInfo.slice(0, 18) + '/' + this.username.slice(0, 10))
  info.querySelector('.menu-info').appendChild(infoNode)

  let menuInfo = this.element.querySelector('.menu-info')
  let menu = this.element.querySelector('.window-menu')
  if (menuInfo) {
    menu.replaceChild(info, menuInfo)
  } else {
    menu.appendChild(info)
  }
}

// For connecting to the server
Chat.prototype.connectToServer = function () {
  // change the classes to show whats happening
  this.element.querySelector('.window-icon').classList.remove('chat-offline')
  this.element.querySelector('.window-icon').classList.add('chat-connecting')

  // start new websocket
  this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')

  // add listeners to the socket
  this.socket.addEventListener('open', this.setOnline.bind(this))
  this.socket.addEventListener('error', this.setOffline.bind(this))
}

// function to set chat offline if error
Chat.prototype.setOffline = function () {
  this.element.querySelector('.window-icon').classList.remove('chat-connecting')
  this.element.querySelector('.window-icon').classList.add('chat-offline')
  this.online = false

  // print message in the chat to show that the connection failed
  let data = {
    username: 'Offline',
    data: 'Connection failed'
  }
  this.printNewMessage(data)
}

// Sets the chat online
Chat.prototype.setOnline = function () {
  this.online = true
  this.element.querySelector('.window-icon').classList.remove('chat-connecting')
  this.element.querySelector('.window-icon').classList.add('chat-online')
}

// For handeling messages received from the server
Chat.prototype.newMessageFromServer = function (event) {
  let data = JSON.parse(event.data)
  if (data.type === 'message') {
    // add timestamp to data-object
    data.timestamp = new Date().toLocaleDateString('sv-se', this.timeStampOptions)
    if (!data.channel) {
      data.channel = ''
    }

    // check the channel and att the message if its the same
    if (data.channel === this.channel) {
      this.printNewMessage(data)
      this.saveNewMessage(data)
    }
  }
}

// Function for submitting messages in the chat
Chat.prototype.formSubmit = function (event) {
  if (event) {
    // dont submit the form standard-way
    event.preventDefault()
  }

  if (this.online) {
    // get the input from form
    let input = this.element.querySelector('.chat-inputField').value

    if (input.length > 1) {
      // check if the last char was enter, remove it
      if (input.charCodeAt(input.length - 1) === 10) {
        input = input.slice(0, -1)
      }

      // the message is at least one char, create object to send
      let msg = {
        type: 'message',
        data: input,
        username: this.username,
        channel: this.channel,
        key: this.key
      }

      // send the object to server
      this.socket.send(JSON.stringify(msg))

      // disable the button and reset the form
      this.element.querySelector('.chat-sendButton').setAttribute('disabled', 'disabled')
      this.element.querySelector('form').reset()
    }
  }
}

// Prints a new message to the chat-window
Chat.prototype.printNewMessage = function (data) {
  // get the container to check scrolled
  let container = this.element.querySelector('.chat-message-list')
  let scrolled = false

  // check if the user has scrolled up
  if (container.scrollTop !== (container.scrollHeight - container.offsetHeight)) {
    scrolled = true
  }

  // get the template for new message and modify it
  let template = document.querySelector('#template-chat-message-line').content.cloneNode(true)
  let usernameNode = document.createTextNode(data.username + ': ')
  let messageNode = this.parseMessage(data.data)

  template.querySelector('.chat-message').appendChild(messageNode)
  if (data.timestamp) {
    // add the timestamp as title
    template.querySelector('.chat-message-line').setAttribute('title', data.timestamp)
  }

  if (this.username === data.username) {
    // it's my message - add class to show that
    template.querySelector('li').classList.add('chat-bubble-me')
  } else {
    // message isn't mine, show that via class
    template.querySelector('li').classList.add('chat-bubble')
    template.querySelector('.chat-username').appendChild(usernameNode)
  }

  // append the new message
  this.element.querySelector('.chat-message-list ul').appendChild(template)

  // autoscroll to bottom
  this.scrollToBottom(scrolled)
}

// Autoscrolls when chat has new message
Chat.prototype.scrollToBottom = function (scrolled) {
  let container = this.element.querySelector('.chat-message-list')
  if (!scrolled) {
    // If user was at bottom, auto-scroll down to the new bottom after new message
    container.scrollTop = container.scrollHeight
  }
}

// For saving a new message to localstorage
Chat.prototype.saveNewMessage = function (data) {
  let newMsg = {
    username: data.username,
    data: data.data,
    timestamp: data.timestamp
  }

  // add the new message to the array and save it
  this.messages.push(newMsg)
  window.localStorage.setItem('chat-' + this.channel, JSON.stringify(this.messages))
}

// Reads messages stored in localstorage
Chat.prototype.readStoredMessages = function () {
  if (window.localStorage.getItem('chat-' + this.channel)) {
    let messages = window.localStorage.getItem('chat-' + this.channel)
    this.messages = JSON.parse(messages)

    // print all the messages from history
    for (let i = 0; i < this.messages.length; i += 1) {
      this.printNewMessage(this.messages[i])
    }

    // add end-of-history separator
    if (this.messages.length > 0) {
      let separator = document.querySelector('#template-chat-history-separator').content.cloneNode(true)
      this.element.querySelector('.chat-message-list ul').appendChild(separator)

      // scroll to bottom
      let container = this.element.querySelector('.chat-message-list')
      container.scrollTop = container.scrollHeight
    }
  }
}

// For toggeling focus
Chat.prototype.toggleFocus = function () {
  this.element.classList.toggle('focused-window')
}

// For checking the input
Chat.prototype.checkInput = function (event) {
  // get the input
  let input = event.target.value

  // handle that the button should only be clickable if input is one or more chars
  if (input.length > 0) {
    this.element.querySelector('.chat-sendButton').removeAttribute('disabled')
  } else {
    this.element.querySelector('.chat-sendButton').setAttribute('disabled', 'disabled')
  }

  // check if the last char was enter, and submit
  if (input.charCodeAt(input.length - 1) === 10) {
    this.formSubmit()
  }

  if (input.charCodeAt(0) === 10) {
    this.element.querySelector('form').reset()
    this.element.querySelector('.chat-sendButton').setAttribute('disabled', 'disabled')
  }
}

// For when links or emojis are sent
Chat.prototype.parseMessage = function (text) {
  let frag = document.createDocumentFragment()
  let link
  let emoji
  let textNode

  // split message into words
  let words = text.split(' ')

  for (let i = 0; i < words.length; i += 1) {
    // search for links
    if (words[i].slice(0, 7) === 'http://') {
      link = words[i].slice(7)
      frag = this.addLinkOrEmojiToFragment(frag, 'link', link)
    } else if (words[i].slice(0, 8) === 'https://') {
      link = words[i].slice(7)
      frag = this.addLinkOrEmojiToFragment(frag, 'link', link)
    } else if (words[i].charAt(0) === ':' || words[i].charAt(0) === ';') {
      emoji = words[i]
      frag = this.addLinkOrEmojiToFragment(frag, 'emoji', emoji)
    } else {
      // append the word as it is
      textNode = document.createTextNode(words[i] + ' ')
      frag.appendChild(textNode)
    }
  }

  return frag
}
// For adding emojis in the messages
Chat.prototype.addLinkOrEmojiToFragment = function (frag, type, data) {
  var textNode
  if (type === 'link') {
    // link found, create a-element
    var aTag = document.createElement('a')
    aTag.setAttribute('href', '//' + data)
    aTag.setAttribute('target', '_blank')
    var linkNode = document.createTextNode(data)

    aTag.appendChild(linkNode)
    textNode = document.createTextNode(' ')

    frag.appendChild(aTag)
    frag.appendChild(textNode)
  } else if (type === 'emoji') {
    // emoji found, create it
    var spanTag = this.parseEmojis(data)

    textNode = document.createTextNode(' ')

    frag.appendChild(spanTag)
    frag.appendChild(textNode)
  }

  return frag
}

// For the emojis in the messages
Chat.prototype.parseEmojis = function (emoji) {
  var template = document.querySelector('#template-chat-emoji').content.cloneNode(true)
  var elem = template.querySelector('.emoji')
  switch (emoji) {
    case ':)':
    case ':-)': {
      elem.classList.add('emoji-smiley')
      break
    }

    case ':D':
    case ':-D': {
      elem.classList.add('emoji-happy')
      break
    }

    case ';)':
    case ';-)': {
      elem.classList.add('emoji-flirt')
      break
    }

    case ':O':
    case ':-O': {
      elem.classList.add('emoji-surprised')
      break
    }

    case ':P':
    case ':-P': {
      elem.classList.add('emoji-tounge')
      break
    }

    case ':@': {
      elem.classList.add('emoji-angry')
      break
    }

    case ':S':
    case ':-S': {
      elem.classList.add('emoji-confused')
      break
    }

    case ':(':
    case ':-(': {
      elem.classList.add('emoji-sad')
      break
    }

    case ":'(":
    case ":'-(": {
      elem.classList.add('emoji-crying')
      break
    }

    case ':L': {
      elem.classList.add('emoji-heart')
      break
    }

    case ':3': {
      elem.classList.add('emoji-cat')
      break
    }

    default: {
      elem = document.createTextNode(emoji)
    }
  }

  return elem
}
// For when user wants to clear the message history
Chat.prototype.clearHistory = function () {
  // remove from storage and reset array
  window.localStorage.removeItem('chat-' + this.channel)
  this.messages = []

  // remove elements from DOM
  let listElement = this.element.querySelector('ul')
  while (listElement.hasChildNodes()) {
    listElement.removeChild(listElement.firstChild)
  }
}

export default Chat
