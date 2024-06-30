declare var require: any; // parcel/typescript workaround.


export function Camera(x, y) {
    this.position = { x: x, y: y };
    this.direction = { x: -1, y: 0 };
    this.plane = { x: 0, y: 1 };
}

Camera.prototype.update = function (dt) {

}