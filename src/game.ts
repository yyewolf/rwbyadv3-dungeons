import { Application } from "pixi.js"
import { Player } from "./player"
import { Hud } from "./hud"
import { Map } from "./map"
import { Resources } from "./resources"
import { Inputs } from "./inputs"
import { Camera } from "pixi3d/pixi7"
import { Notification } from "./notification"
import { Loading } from "./loading"

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
        this.map = new Map(this, { grid: [], loots: [] })
        this.player = new Player(this, Camera.main);

        this.update = this.update.bind(this)
        this.endGame = this.endGame.bind(this)
    }

    async initialize() {
        let progressBar = new Loading(this)
        this.app.stage.addChild(progressBar);
        this.resources.onProgress = progressBar.setProgress
        await this.resources.initialize()

        // @ts-ignore
        let data = await fetch("/dungeons/api/dungeon/" + dungeonId).then(res => res.json());
        this.map = new Map(this, data);
        this.map.generate()

        this.player = new Player(this, Camera.main);
        this.player.initialize();

        this.hud = new Hud(this);

        this.app.stage.removeChild(progressBar)
    }

    public bindEvents() {
        let that = this
        window.addEventListener('keyup', function (event) {
            that.inputsController.onKeyup(event);

            // if it's J, 
            if (event.keyCode === 74) {
                // create new notification
                new Notification(that, { message: "Welcome to the dungeon!", time: 5 })
            }
            // if it's K,
            if (event.keyCode === 75) {
                // create new notification
                that.endGame()
            }
        }, false);
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

    public endGame() {
        this.endGame = () => { }
        this.player.endGame();
        this.hud?.endGame();

        // free the pointer
        document.exitPointerLock();

        // send end request
        // @ts-ignore
        fetch("/dungeons/api/dungeon/" + dungeonId + "/end", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.player.response)
        }).then(res => res.json()).then(data => {
            console.log(data);
        });
    }
}