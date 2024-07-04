/// <reference path='../global.d.ts' />

import { Application, Assets } from "pixi.js"
import { Camera, LightingEnvironment, Mesh3D, Light, LightType, StandardMaterial, Color } from "pixi3d/pixi7"
import { Inputs } from "./inputs"
import { Player } from "./player"
import { Map } from "./map"

let app = new Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view as HTMLCanvasElement)

const manifest = {
  bundles: [{
    name: "wood",
    assets: [
      {
        name: "baseColor",
        srcs: "assets/wood/worn_planks_diff_1k.jpg",
      },
      {
        name: "normal",
        srcs: "assets/wood/worn_planks_nor_gl_1k.jpg",
      },
      {
        name: "roughness",
        srcs: "assets/wood/worn_planks_rough_1k.jpg",
      },
      {
        name: "emissive",
        srcs: "assets/wood/worn_planks_disp_1k.jpg",
      },
    ],
  }]
}

await Assets.init({ manifest })
let wood = await Assets.loadBundle("wood")
let walls = await fetch("map").then(res => res.json())
let map = new Map(app, wood, walls)

// Load the inputs controller
const inputsController = new Inputs();
window.addEventListener('keyup', function (event) { inputsController.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { inputsController.onKeydown(event); }, false);

// Load the player from the main camera
const player = new Player(app, Camera.main, inputsController, map);
window.addEventListener('pointermove', function (event) { player.handlePointerMove(event); }, false);

// Put player in the maze
// player.camera.position.set(0, 0.5, 0);

// lock the pointer on click
// @ts-ignore
app.view.addEventListener('click', () => app.view.requestPointerLock());

function update() {
  player.update();

  requestAnimationFrame(update);
}

update();