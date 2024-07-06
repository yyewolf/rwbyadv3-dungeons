export class Inputs {
    private _pressed: { [key: number]: boolean } = {};

    public W = 87;
    public S = 83;
    public D = 68;
    public A = 65;
    public Q = 81;
    public Z = 90;

    static horizontalPower = 0;
    static verticalPower = 0;

    isDown(keyCode: number) {
        return this._pressed[keyCode];
    }

    onKeydown(event: KeyboardEvent) {
        this._pressed[event.keyCode] = true;
    }

    onKeyup(event: KeyboardEvent) {
        delete this._pressed[event.keyCode];
    }

    onJoyStickChange(event: any) {
        // Convert angle to radian
        let angle = event.angle * Math.PI / 180;
        let power = event.power;

        Inputs.horizontalPower = Math.cos(angle) * power;
        Inputs.verticalPower = Math.sin(angle) * power;
    }

    onJoyStickEnd() {
        Inputs.horizontalPower = 0;
        Inputs.verticalPower = 0;
    }
};