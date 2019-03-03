'use strict'

const Memory = require('./memory/memory')

function Launcher (desktop) {
  this.desktop = desktop
}
Launcher.prototype.init = function () {
  document.querySelector('.launcher').addEventListener('click', this.launcherClick.bind(this))
}
