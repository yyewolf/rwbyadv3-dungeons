import { Application } from "pixi.js"
import { Player } from "./player"
import { Hud } from "./hud"
import { Map } from "./map"
import { Resources } from "./resources"
import { Inputs } from "./inputs"
import { Camera } from "pixi3d/pixi7"

export class Game {
    app: Application
    resources: Resources
    inputsController: Inputs
    map: Map
    player: Player
    hud?: Hud

    constructor(app: Application) {
        this.app = app

        this.resources = new Resources();
        this.inputsController = new Inputs();
        this.map = new Map(this, { grid: [] })
        this.player = new Player(this, Camera.main);

        this.update = this.update.bind(this)
    }

    async initialize() {
        let data = await fetch("map").then(res => res.json());
        this.map = new Map(this, data);

        this.player = new Player(this, Camera.main);
        this.player.initialize();

        this.hud = new Hud(this);
    }

    public bindEvents() {
        let that = this
        window.addEventListener('keyup', function (event) { that.inputsController.onKeyup(event); }, false);
        window.addEventListener('keydown', function (event) { that.inputsController.onKeydown(event); }, false);
        // @ts-ignore
        this.app.view.addEventListener('click', () => that.app.view.requestPointerLock());
        window.addEventListener('resize', () => {
            that.app.renderer.resize(window.innerWidth, window.innerHeight);
            that.hud?.onResize();
        });
        window.addEventListener('pointerdown', (e) => that.hud?.onPointerDown(e), false);
        window.addEventListener('pointerup', (e) => that.hud?.onPointerUp(e), false);
        window.addEventListener('pointermove', function (event) {
            if (that.hud?.joystick.pointerId !== event.pointerId) {
                that.player?.handlePointerMove(event);
            }
        }, false);
    }

    public update() {
        this.player.update();
        this.hud?.update();
        requestAnimationFrame(this.update);
    }
}