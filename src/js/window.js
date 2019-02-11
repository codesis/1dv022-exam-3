class window {
  constructor (options) {
    this.id = options.id || '' + new Date().getTime()
    this.element = undefined
    this.x = options.x || 10
    this.y = options.y || 10
  }
  render () {
    let template = document.querySelector('#desktop-window').content.cloneNode(true)
    let templateWindow = template.querySelector('div')
    templateWindow.setAttribute('id', this.id)
  }
}
