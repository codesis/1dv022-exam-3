'use strict'

/**
 * Constructor for the chat
 * @param element - the elemnt to print to
 * @param server - the server
 * @param channel - the channel, default empty
 * @param username - username
 * @constructor
 */
function Chat (element, server, channel, username) {
  this.element = element
  this.server = server
  this.channel = channel || ''
  this.username = username
  this.socket = undefined
  this.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  this.online = false
  this.messages = []

  // the timestampoptions to use
  this.timeStampOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
}

export default Chat
