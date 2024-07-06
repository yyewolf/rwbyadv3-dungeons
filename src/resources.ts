import { Assets } from "pixi.js"

const manifest = {
    bundles: [
        {
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
        },
        {
            name: "stone",
            assets: [
                {
                    name: "baseColor",
                    srcs: "assets/stone/Stone_Floor_002_COLOR.jpg",
                },
                {
                    name: "normal",
                    srcs: "assets/stone/Stone_Floor_002_NORM.jpg",
                },
                {
                    name: "occlusion",
                    srcs: "assets/stone/Stone_Floor_002_OCC.jpg",
                },
                {
                    name: "emissive",
                    srcs: "assets/stone/Stone_Floor_002_DISP.png",
                },
            ],
        },
        {
            name: "crosshair",
            assets: [
                {
                    name: "base",
                    srcs: "assets/crosshair.png",
                },
            ],
        },
        {
            name: "joystick",
            assets: [
                {
                    name: "base",
                    srcs: "assets/joystick/joystick.png",
                },
                {
                    name: "handle",
                    srcs: "assets/joystick/joystick-handle.png",
                },
            ],
        },
    ]
}
await Assets.init({ manifest })

let wood = await Assets.loadBundle("wood")
let stone = await Assets.loadBundle("stone")
let crosshair = await Assets.loadBundle("crosshair")
let joystick = await Assets.loadBundle("joystick")

export class Resources {
    wood: any
    stone: any
    crosshair: any
    joystick: any

    constructor() {
        this.wood = wood
        this.stone = stone
        this.crosshair = crosshair
        this.joystick = joystick
    }
}