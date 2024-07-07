/// <reference path='../global.d.ts' />

import { Application } from "pixi.js"
import { Game } from "./game"
import { Notification } from "./notification";

let app = new Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view as HTMLCanvasElement);

let game = new Game(app)

await game.initialize()

game.bindEvents()
game.update()

setTimeout(() => {
  new Notification(game, { message: "Welcome to the dungeon!", time: 5 })
}, 1000)