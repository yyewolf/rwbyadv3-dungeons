import { Assets } from "pixi.js"

const manifest = {
    bundles: [
        {
            name: "wood",
            assets: [
                {
                    name: "baseColor",
                    srcs: "/dungeons/static/assets/wood/worn_planks_diff_1k.jpg",
                },
                {
                    name: "normal",
                    srcs: "/dungeons/static/assets/wood/worn_planks_nor_gl_1k.jpg",
                },
                {
                    name: "roughness",
                    srcs: "/dungeons/static/assets/wood/worn_planks_rough_1k.jpg",
                },
                {
                    name: "emissive",
                    srcs: "/dungeons/static/assets/wood/worn_planks_disp_1k.jpg",
                },
            ],
        },
        {
            name: "stone",
            assets: [
                {
                    name: "baseColor",
                    srcs: "/dungeons/static/assets/stone/Stone_Floor_002_COLOR.jpg",
                },
                {
                    name: "normal",
                    srcs: "/dungeons/static/assets/stone/Stone_Floor_002_NORM.jpg",
                },
                {
                    name: "occlusion",
                    srcs: "/dungeons/static/assets/stone/Stone_Floor_002_OCC.jpg",
                },
                {
                    name: "emissive",
                    srcs: "/dungeons/static/assets/stone/Stone_Floor_002_DISP.png",
                },
            ],
        },
        {
            name: "crosshair",
            assets: [
                {
                    name: "base",
                    srcs: "/dungeons/static/assets/crosshair.png",
                },
            ],
        },
        {
            name: "joystick",
            assets: [
                {
                    name: "base",
                    srcs: "/dungeons/static/assets/joystick/joystick.png",
                },
                {
                    name: "handle",
                    srcs: "/dungeons/static/assets/joystick/joystick-handle.png",
                },
            ],
        },
        {
            name: "moneybag",
            assets: [
                {
                    name: "model",
                    srcs: "/dungeons/static/assets/moneybag/scene.gltf",
                    format: 'gltf',
                },
            ],
        },
        {
            name: "portal",
            assets: [
                {
                    name: "portal",
                    srcs: "/dungeons/static/assets/portal/portal.png",
                },
            ],
        },
    ]
}
await Assets.init({ manifest })

export class Resources {
    loaded: boolean = false
    wood: any
    stone: any
    crosshair: any
    joystick: any
    moneybag: any
    portal: any
    onProgress: (percent: number) => void = () => { }

    constructor() {
        this.initialize = this.initialize.bind(this)
    }

    initialize() {
        let that = this;
        return new Promise(async (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
            that.wood = await Assets.loadBundle("wood")
            that.onProgress(0.4)
            that.moneybag = await Assets.loadBundle("moneybag")
            that.onProgress(0.5)
            that.stone = await Assets.loadBundle("stone")
            that.onProgress(0.6)
            that.crosshair = await Assets.loadBundle("crosshair")
            that.onProgress(0.7)
            that.joystick = await Assets.loadBundle("joystick")
            that.onProgress(0.8)
            that.portal = await Assets.loadBundle("portal")
            that.onProgress(1)

            that.loaded = true
            resolve(true)
        })
    }
}