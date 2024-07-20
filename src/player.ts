import { Camera, Color, Light, LightType, LightingEnvironment, Mesh3D, Quat, StandardMaterial } from "pixi3d/pixi7"
import { Inputs } from "./inputs";
import { ObservablePoint } from "pixi.js";
import { Game } from "./game";

export class Player {
    game: Game;
    camera: Camera;
    moveSpeed: number = 0.75;
    mapPosition: { x: number, y: number, realX: number, realY: number } = { x: 0, y: 0, realX: 0, realY: 0 }
    response: any = {
        loots: []
    };

    _angles = new ObservablePoint(() => {
        this._angles.x = Math.min(Math.max(-85, this._angles.x), 85)
    }, undefined, 0, 180)

    constructor(game: Game, camera: Camera) {
        this.camera = camera;
        this.game = game;

        this.endGame = this.endGame.bind(this);
    }

    torch: Light = new Light();
    visionSphere: Mesh3D = Mesh3D.createSphere();

    public initialize() {
        this.camera.position.set((2 - this.game.map.walls[0].length) * 2, 0, (2 - this.game.map.walls.length) * 2)

        this.torch
        this.torch.intensity = 75
        this.torch.range = 20
        this.torch.type = LightType.point
        this.torch.color = new Color(0.9, 0.5, 0.2)
        this.torch.rotationQuaternion.setEulerAngles(25, 120, 0)
        LightingEnvironment.main.lights.push(this.torch)

        this.visionSphere = this.game.app.stage.addChild(Mesh3D.createSphere())
        this.visionSphere.scale.set(15, 15, 15)
        let mat = this.visionSphere.material as StandardMaterial
        mat.doubleSided = true
    }

    private goForward(power: number) {
        let moveSpeed = this.moveSpeed * power;

        let yaw = this._angles.y

        let x = Math.sin(yaw * Math.PI / 180)
        let z = Math.cos(yaw * Math.PI / 180)

        let nextX = this.camera.position.x + x * (moveSpeed * 2 + 4 * power)
        let nextZ = this.camera.position.z + z * (moveSpeed * 2 + 4 * power)
        let j = Math.round((nextX + 2 * this.game.map.walls[0].length) / 2)
        let i = Math.round((nextZ + 2 * this.game.map.walls.length) / 2)

        // if (this.game.map.walls[i][j] === 0) {
        this.camera.position.x += x * moveSpeed
        this.camera.position.z += z * moveSpeed
        // }
    }

    private goLeft(power: number) {
        let moveSpeed = this.moveSpeed * power;

        let yaw = this._angles.y

        let x = Math.sin(yaw * Math.PI / 180)
        let z = Math.cos(yaw * Math.PI / 180)

        let nextX = this.camera.position.x + z * (moveSpeed * 2 + 4 * power)
        let nextZ = this.camera.position.z - x * (moveSpeed * 2 + 4 * power)
        let j = Math.round((nextX + 2 * this.game.map.walls[0].length) / 2)
        let i = Math.round((nextZ + 2 * this.game.map.walls.length) / 2)

        // if (this.game.map.walls[i][j] === 0) {
        this.camera.position.x += z * moveSpeed
        this.camera.position.z -= x * moveSpeed
        // }
    }

    public update() {
        if (this.game.inputsController.isDown(this.game.inputsController.W) || this.game.inputsController.isDown(this.game.inputsController.Z)) {
            this.goForward(0.1);
        } else if (Inputs.verticalPower > 0) {
            this.goForward(0.1 * Inputs.verticalPower);
        }

        if (this.game.inputsController.isDown(this.game.inputsController.S)) {
            this.goForward(-0.1);
        } else if (Inputs.verticalPower < 0) {
            this.goForward(0.1 * Inputs.verticalPower);
        }

        if (this.game.inputsController.isDown(this.game.inputsController.A) || this.game.inputsController.isDown(this.game.inputsController.Q)) {
            this.goLeft(0.1);
        } else if (Inputs.horizontalPower > 0) {
            this.goLeft(- 0.1 * Inputs.horizontalPower);
        }

        if (this.game.inputsController.isDown(this.game.inputsController.D)) {
            this.goLeft(-0.1);
        } else if (Inputs.horizontalPower < 0) {
            this.goLeft(- 0.1 * Inputs.horizontalPower);
        }

        // Temporary, space goes up
        if (this.game.inputsController.isDown(32)) {
            this.camera.position.y += 0.1;
        }
        // Temporary, shift goes down
        if (this.game.inputsController.isDown(16)) {
            this.camera.position.y -= 0.1;
        }

        this.torch.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        this.visionSphere.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);

        // Hide walls far away
        for (let i = 0; i < this.game.map.objects.length; i++) {
            for (let j = 0; j < this.game.map.objects[i].length; j++) {
                for (let k = 0; k < this.game.map.objects[i][j].length; k++) {
                    let obj = this.game.map.objects[i][j][k];
                    let distance = Math.sqrt((this.camera.position.x - obj.position.x) ** 2 + (this.camera.position.z - obj.position.z) ** 2);
                    if (distance > 20) {
                        obj.visible = false;
                    } else {
                        obj.visible = true;
                    }
                }
            }
        }

        let j = (this.camera.x + 2 * this.game.map.walls[0].length) / 2;
        let i = (this.camera.z + 2 * this.game.map.walls.length) / 2;
        this.mapPosition = { realX: i, realY: j, x: Math.round(i), y: Math.round(j) };

        // If in loot box, destroy loot and call pickedUp
        for (let i = 0; i < this.game.map.loots.length; i++) {
            let loot = this.game.map.loots[i];
            let object = loot.object;
            let distance = Math.sqrt((this.camera.position.x - object.position.x) ** 2 + (this.camera.position.z - object.position.z) ** 2);
            if (distance < 1) {
                loot.pickedUp(this);
                this.response.loots.push(loot.id);
                this.game.map.loots.splice(i, 1);
                object.destroy();
            }
        }

        // Debugging purposes
        // console.log(this.camera.z, this.camera.x);
    }

    public handlePointerMove(event: PointerEvent) {
        this._angles.x += event.movementY * 0.5;
        this._angles.y -= event.movementX * 0.5;
        this.updateCamera();
    }


    public updateCamera(): void {
        const angles = this._angles;

        const rot = Quat.fromEuler(angles.x, angles.y, 0, new Float32Array(4));

        this.camera.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3]);
    }

    public endGame() {
        this.update = () => { };
        this.handlePointerMove = () => { };
        this.updateCamera = () => { };
        this.game.endGame();
    }
}