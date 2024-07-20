import { Application, Circle, Container, Graphics, Rectangle, Sprite, Text } from "pixi.js"
import { Resources } from "./resources"
import { Joystick } from "../lib/joystick"
import { Inputs } from "./inputs"
import { Map } from "./map"
import { Player } from "./player"
import { Game } from "./game"

export class Hud {
    game: Game
    joystick: Joystick
    crosshair: Sprite
    minimap: Container
    hud: Container

    constructor(game: Game) {
        this.game = game
        this.crosshair = new Sprite(this.game.resources.crosshair.base)
        this.crosshair.anchor.set(0.5)

        this.joystick = new Joystick({
            outer: new Sprite(this.game.resources.joystick.base),
            inner: new Sprite(this.game.resources.joystick.handle),

            outerScale: { x: 0.5, y: 0.5 },
            innerScale: { x: 0.8, y: 0.8 },

            onChange: this.game.inputsController.onJoyStickChange,
            onEnd: this.game.inputsController.onJoyStickEnd,
            onStart: () => { },
        });

        this.minimap = new Container()
        this.hud = new Container()

        this.game.app.stage.addChild(this.minimap);
        this.game.app.stage.addChild(this.joystick);
        this.game.app.stage.addChild(this.crosshair);
        this.game.app.stage.addChild(this.hud);

        this.onResize()
        this.update = this.update.bind(this)
        this.endGame = this.endGame.bind(this)
    }

    onPointerDown(event: PointerEvent) {
        // if is in bound of joystick
        if (event.clientX < 200 && event.clientY > this.game.app.screen.height - 200) {
            this.joystick.pointerId = event.pointerId;
        }
    }
    onPointerUp(event: PointerEvent) {
        // if it's the same pointer
        if (this.joystick.pointerId === event.pointerId) {
            this.joystick.pointerId = -1;
        }
    }

    onResize() {
        this.crosshair.position.set(this.game.app.screen.width / 2, this.game.app.screen.height / 2)
        this.crosshair.scale.set(this.game.app.screen.width / 1920, this.game.app.screen.height / 1080)
        this.joystick.position.set(100, this.game.app.screen.height - 100)
    }

    update() {
        // Draw the minimap
        this.minimap.removeChildren()

        // Make the minimap a 5x5 grid around the position of the player
        let player = this.game.player
        let map = this.game.map
        let walls = map.walls

        for (let i = player.mapPosition.x - 7; i < player.mapPosition.x + 7; i++) {
            for (let j = player.mapPosition.y - 7; j < player.mapPosition.y + 7; j++) {
                if (i >= 0 && i < walls.length && j >= 0 && j < walls[0].length) {
                    let color = 0xffffff
                    if (walls[i][j] === 1) {
                        continue
                    }
                    let tile = new Graphics()
                    tile.beginFill(color)
                    tile.drawRect((i - (player.mapPosition.x - 7)) * 10 + 20, (j - (player.mapPosition.y - 7)) * 10 + 20, 10, 10)
                    tile.endFill()
                    this.minimap.addChild(tile)
                }
            }
        }

        // Draw the player
        let playerDot = new Graphics()
        playerDot.beginFill(0x00ff00)
        playerDot.drawCircle((player.mapPosition.realX - player.mapPosition.x) * 10 + 95, (player.mapPosition.realY - player.mapPosition.y) * 10 + 95, 4)
        playerDot.endFill()
        this.minimap.addChild(playerDot)

        // circle center 
        let circleX = (player.mapPosition.realX - player.mapPosition.x) * 10 + 95
        let circleY = (player.mapPosition.realY - player.mapPosition.y) * 10 + 95

        // Add a rotation marker to show the player's direction
        // this.minimap.pivot.set(90, 90)
        // this.minimap.position.set(100, 100)
        // this.minimap.rotation = -player._angles.y * Math.PI / 180
        let rotationMarker = new Graphics()
        rotationMarker.beginFill(0xff0000)
        rotationMarker.moveTo(circleX, circleY)
        rotationMarker.drawPolygon([
            // triangle up
            circleX, circleY + 10,
            circleX + 5, circleY + 5,
            circleX - 5, circleY + 5,
        ])
        rotationMarker.endFill()
        // set pivot point
        rotationMarker.pivot.set(circleX, circleY)
        rotationMarker.position.set(circleX, circleY)
        // rotate around the pivot point
        rotationMarker.rotation = player._angles.y * Math.PI / 180 - Math.PI / 2
        this.minimap.addChild(rotationMarker)

        // Add a circle mask to hide the blocky edges
        let mask = new Graphics()
        mask.beginFill(0x000000)
        mask.drawCircle(90, 90, 60)
        mask.endFill()
        this.minimap.addChild(mask)
        this.minimap.mask = mask

        this.hud.removeChildren()

        // Add a text below to show the coordinates
        let coordText = new Text(`(${player.mapPosition.x}, ${player.mapPosition.y})`, { fill: 0xffffff })
        coordText.position.set(20, 180)
        this.hud.addChild(coordText)
    }

    public endGame() {
        this.update = () => { }

        this.joystick.destroy()
        this.crosshair.destroy()
        this.minimap.destroy()
        for (let child of this.hud.children) {
            child.destroy()
        }

        // add gray background
        let background = new Graphics()
        background.beginFill(0x000000, 0.5)
        background.drawRect(0, 0, this.game.app.screen.width, this.game.app.screen.height)
        background.endFill()
        this.hud.addChild(background)

        let text = new Text("You finished the dungeon!", { fill: 0xffffff, fontSize: 50 })
        text.anchor.set(0.5)
        text.position.set(this.game.app.screen.width / 2, this.game.app.screen.height / 2)
        this.hud.addChild(text)
    }
}
