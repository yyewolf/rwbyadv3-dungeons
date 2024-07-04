export class Inputs {
    private _pressed: { [key: number]: boolean } = {};

    public W = 87;
    public S = 83;
    public D = 68;
    public A = 65;
    public Q = 81;
    public Z = 90;

    stopMoving() {
        delete this._pressed[this.W];
        delete this._pressed[this.S];
        delete this._pressed[this.A];
        delete this._pressed[this.D];
    }

    isDown(keyCode: number) {
        return this._pressed[keyCode];
    }

    onKeydown(event: KeyboardEvent) {
        this._pressed[event.keyCode] = true;
    }

    onKeyup(event: KeyboardEvent) {
        delete this._pressed[event.keyCode];
    }
};