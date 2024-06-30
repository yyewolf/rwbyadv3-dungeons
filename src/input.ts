// Brilliantly simple input code from http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
export const Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,

  goDir: function (dir) {
    switch (dir) {
      case 'left':
        this._pressed[this.LEFT] = true;
        break;
      case 'up':
        this._pressed[this.UP] = true;
        break;
      case 'right':
        this._pressed[this.RIGHT] = true;
        break;
      case 'down':
        this._pressed[this.DOWN] = true;
        break;
    }
  },

  stopMoving: function () {
    delete this._pressed[this.UP];
    delete this._pressed[this.DOWN];
    delete this._pressed[this.LEFT];
    delete this._pressed[this.RIGHT];
  },

  isDown: function (keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function (event) {
    this._pressed[event.keyCode] = true;
    if (event.keyCode == this.LEFT ||
      event.keyCode == this.UP ||
      event.keyCode == this.RIGHT ||
      event.keyCode == this.DOWN ||
      event.keyCode == this.SPACE) {
      event.preventDefault();
    }
  },

  onKeyup: function (event) {
    delete this._pressed[event.keyCode];
  }
};
window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);