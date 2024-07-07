import { Model } from "pixi3d/pixi7"
import { Player } from "./player"
import { Resources } from "./resources"
import { Notification } from "./notification"

export interface Loot {
    x: number
    y: number
    type: string
    available: boolean
    object: any

    pickedUp: (player: Player) => void

    model: (resources: Resources) => Model
    place: (object: any, x: number, y: number) => void
}

export class MoneyBag implements Loot {
    x: number
    y: number
    amount: number
    available: boolean = true
    object: any
    type = "money"

    constructor(data: any) {
        this.x = data.x
        this.y = data.y
        this.amount = data.amount
        this.available = data.available ?? true

        this.pickedUp = this.pickedUp.bind(this)
        this.place = this.place.bind(this)
    }

    pickedUp(player: Player) {
        player.response.money += this.amount
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