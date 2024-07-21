import { Model, Sprite3D, SpriteBillboardType } from "pixi3d/pixi7"
import { Player } from "./player"
import { Resources } from "./resources"
import { Notification } from "./notification"
import { Application, Rectangle, Texture } from "pixi.js"

export interface Loot {
    id: string
    x: number
    y: number
    type: string
    available: boolean
    object: any

    pickedUp: (player: Player) => void

    model: (resources: Resources) => Model | Sprite3D
    place: (object: any, x: number, y: number) => void

    animate?: (app: Application) => void
}

export class MoneyBag implements Loot {
    id: string
    x: number
    y: number
    amount: number
    available: boolean = true
    object: any
    type = "money"

    constructor(data: any) {
        this.id = data.id
        this.x = data.x
        this.y = data.y
        this.amount = data.amount
        this.available = data.available ?? true

        this.pickedUp = this.pickedUp.bind(this)
        this.place = this.place.bind(this)
    }

    pickedUp(player: Player) {
        this.available = false
        new Notification(player.game, { message: `You picked up ${this.amount} coins!`, time: 5 })
    }

    model(resources: Resources) {
        return Model.from(resources.moneybag.model)
    }

    place(object: any, x: number, y: number) {
        let scale = ((this.amount - 50) / 200) + 0.1
        // get the model height to put it on the floor
        let scaleHeight = 0.556 * scale - 1.056
        object.position.set(x, scaleHeight, y)
        object.scale.set(scale, scale, scale)

        this.object = object
    }
}

export class Exit implements Loot {
    id: string
    x: number
    y: number
    available: boolean = true
    object: any
    type = "exit"

    textures: any[] = [];
    sprite?: Sprite3D

    constructor(data: any) {
        this.id = data.id
        this.x = data.x
        this.y = data.y
        this.available = data.available ?? true

        this.pickedUp = this.pickedUp.bind(this)
        this.place = this.place.bind(this)
        this.animate = this.animate.bind(this)
    }

    pickedUp(player: Player) {
        this.available = false
        player.response.loots.push(this.id)
        player.endGame()
    }

    model(resources: Resources) {
        // Generate the frames from the texture
        for (let i = 0; i < 4; i++) {
            let frame = new Texture(
                resources.portal.portal,
                new Rectangle(i * 250, 0, 250, 592)
            );
            this.textures.push(frame);
        }

        // Create the sprite using the first frame
        this.sprite = new Sprite3D(this.textures[0]);
        this.sprite.billboardType = SpriteBillboardType.cylindrical;

        return this.sprite;
    }

    place(object: any, x: number, y: number) {
        // get the model height to put it on the floor
        object.position.set(x, -0.25, y)
        object.scale.set(0.25, 0.25, 0.25)

        this.object = object
    }

    animate(app: Application) {
        // Animation variables
        let currentFrame = 0;
        let frameCount = 4;
        let animationSpeed = 0.05; // Adjust the speed as necessary
        let animationTicker = 0;

        // Animate the sprite
        app.ticker.add((delta) => {
            animationTicker += delta * animationSpeed;
            if (animationTicker >= 1) {
                animationTicker = 0;
                currentFrame = (currentFrame + 1) % frameCount;
                if (this.sprite) {
                    this.sprite.texture = this.textures[currentFrame];
                }
            }
        });
    }
}