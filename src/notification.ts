import { Container, Graphics, Text } from "pixi.js"
import { Game } from "./game"


export class Notification {
    x: number
    y: number
    message: string
    time: number
    object: any

    // Animation utils
    previousTime: Date

    constructor(game: Game, data: { message: string, time: number }) {
        this.message = data.message
        this.time = data.time

        let notificationText = new Text(this.message, { fill: 0xffffff })
        notificationText.position.set(10, 10)
        let background = new Graphics()
        // ligh blue transparent background
        background.beginFill(0x0000ff, 0.5)
        background.drawRoundedRect(0, 0, notificationText.width + 20, notificationText.height + 20, 5)
        background.endFill()

        this.x = game.app.screen.width - 100 - notificationText.width
        this.y = -50 - notificationText.height

        this.object = new Container()
        this.object.position.set(this.x, this.y)
        this.object.addChild(background)
        this.object.addChild(notificationText)
        game.app.stage.addChild(this.object)

        this.previousTime = new Date()

        this.animate = this.animate.bind(this)
        requestAnimationFrame(this.animate)
    }

    animate() {
        let now = new Date()

        // Move the notification down
        let delta = (now.getTime() - this.previousTime.getTime()) / 1000
        this.y += 100 * delta * (2 - delta)
        this.object.position.set(this.x, this.y)

        // Stop at y 20
        if (this.y >= 20) {
            this.y = 20
            this.object.position.set(this.x, this.y)
        }

        // Remove the notification after time
        this.time -= delta
        if (this.time <= 0) {
            console.log("Destroying notification")
            this.object.destroy()
            return
        }

        this.previousTime = now
        requestAnimationFrame(this.animate)
    }
}