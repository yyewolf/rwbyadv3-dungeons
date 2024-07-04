import { Camera, Color, Light, LightType, LightingEnvironment, Mesh3D, Quat, StandardMaterial } from "pixi3d/pixi7"
import { Inputs } from "./inputs";
import { Application, ObservablePoint } from "pixi.js";
import { Map } from "./map";

export class Player {
    app: Application;
    camera: Camera;
    inputsController: Inputs;
    map: Map;

    powerHorizontal: number = 0;
    powerVertical: number = 0;

    moveSpeed: number = 1;

    protected _angles = new ObservablePoint(() => {
        this._angles.x = Math.min(Math.max(-85, this._angles.x), 85)
    }, undefined, 0, 180)

    constructor(app: Application, camera: Camera, inputsController: Inputs, map: Map) {
        this.camera = camera;
        this.inputsController = inputsController;
        this.app = app
        this.map = map

        this.camera.position.set(-10, 0, -10)
        this.init()
    }

    torch: Light;
    visionSphere: Mesh3D;

    private init() {
        this.torch = new Light()
        this.torch.intensity = 100
        this.torch.type = LightType.point
        this.torch.color = new Color(1, 0.35, 0)
        this.torch.rotationQuaternion.setEulerAngles(25, 120, 0)
        LightingEnvironment.main.lights.push(this.torch)

        this.visionSphere = this.app.stage.addChild(Mesh3D.createSphere())
        this.visionSphere.scale.set(15, 15, 15)
        let mat = this.visionSphere.material as StandardMaterial
        mat.doubleSided = true
    }

    private goForward(power: number) {
        let moveSpeed = this.moveSpeed * power;

        let yaw = this._angles.y

        let x = Math.sin(yaw * Math.PI / 180)
        let z = Math.cos(yaw * Math.PI / 180)

        let nextX = this.camera.position.x + x * (moveSpeed + 4 * power)
        let nextZ = this.camera.position.z + z * (moveSpeed + 4 * power)
        let j = Math.round((nextX + 2 * this.map.walls[0].length) / 2)
        let i = Math.round((nextZ + 2 * this.map.walls.length) / 2)

        if (this.map.walls[i][j] === 0) {
            this.camera.position.x += x * moveSpeed
            this.camera.position.z += z * moveSpeed
        } else {
            // go back a bit
            this.camera.position.x -= x * moveSpeed
            this.camera.position.z -= z * moveSpeed
        }
    }

    private goLeft(power: number) {
        let moveSpeed = this.moveSpeed * power;

        let yaw = this._angles.y

        let x = Math.sin(yaw * Math.PI / 180)
        let z = Math.cos(yaw * Math.PI / 180)

        let nextX = this.camera.position.x + z * (moveSpeed + 4 * power)
        let nextZ = this.camera.position.z - x * (moveSpeed + 4 * power)
        let j = Math.round((nextX + 2 * this.map.walls[0].length) / 2)
        let i = Math.round((nextZ + 2 * this.map.walls.length) / 2)

        if (this.map.walls[i][j] === 0) {
            this.camera.position.x += z * moveSpeed
            this.camera.position.z -= x * moveSpeed
        } else {
            // go back a bit
            this.camera.position.x -= z * moveSpeed
            this.camera.position.z += x * moveSpeed
        }
    }

    public update() {
        if (this.inputsController.isDown(this.inputsController.W) || this.inputsController.isDown(this.inputsController.Z)) {
            this.goForward(0.1);
        }
        if (this.inputsController.isDown(this.inputsController.S)) {
            this.goForward(-0.1);
        }
        if (this.inputsController.isDown(this.inputsController.A) || this.inputsController.isDown(this.inputsController.Q)) {
            this.goLeft(0.1);
        }
        if (this.inputsController.isDown(this.inputsController.D)) {
            this.goLeft(-0.1);
        }

        // Temporary, space goes up
        if (this.inputsController.isDown(32)) {
            this.camera.position.y += 0.1;
        }
        // Temporary, shift goes down
        if (this.inputsController.isDown(16)) {
            this.camera.position.y -= 0.1;
        }

        this.torch.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z)
        this.visionSphere.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z)

        // Hide walls far away
        for (let i = 0; i < this.map.objects.length; i++) {
            for (let j = 0; j < this.map.objects[i].length; j++) {
                for (let k = 0; k < this.map.objects[i][j].length; k++) {
                    let obj = this.map.objects[i][j][k]
                    let distance = Math.sqrt((this.camera.position.x - obj.position.x) ** 2 + (this.camera.position.z - obj.position.z) ** 2)
                    if (distance > 20) {
                        obj.visible = false
                    } else {
                        obj.visible = true
                    }
                }
            }
        }

        let j = Math.round((this.camera.x + 2 * this.map.walls[0].length) / 2)
        let i = Math.round((this.camera.z + 2 * this.map.walls.length) / 2)
        console.log(i, j)
    }

    public handlePointerMove(event: PointerEvent) {
        this._angles.x += event.movementY * 0.5
        this._angles.y -= event.movementX * 0.5
        this.updateCamera()
    }


    public updateCamera(): void {
        const angles = this._angles

        const rot = Quat.fromEuler(angles.x, angles.y, 0, new Float32Array(4))

        this.camera.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3])
    }
}