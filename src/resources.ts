declare var require: any; // parcel/typescript workaround.

import * as PIXI from "pixi.js";
import { Config } from "./config";

export var Resources = {
    pool: {},
    init: function () {
        var texture: any = [[], [], [], [], [], [], [], []];
        var brick = PIXI.BaseTexture.from('redbrick'),
            wood = PIXI.BaseTexture.from('wood'),
            purpstone = PIXI.BaseTexture.from('purplestone'),
            mossy = PIXI.BaseTexture.from('mossy'),
            grey = PIXI.BaseTexture.from('greystone'),
            blue = PIXI.BaseTexture.from('bluestone'),
            eagle = PIXI.BaseTexture.from('eagle'),
            color = PIXI.BaseTexture.from('colorstone');
        for (var x = 0; x < Config.texWidth; x++) {
            texture[0][x] = new PIXI.Texture(eagle, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[1][x] = new PIXI.Texture(brick, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[2][x] = new PIXI.Texture(purpstone, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[3][x] = new PIXI.Texture(grey, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[4][x] = new PIXI.Texture(blue, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[5][x] = new PIXI.Texture(mossy, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[6][x] = new PIXI.Texture(wood, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            texture[7][x] = new PIXI.Texture(color, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
        }
        this.store('texture', texture);
        var gunTexture: any = [];
        var gunBase = PIXI.BaseTexture.from('pistol');
        for (var i = 0; i < 3; i++) {
            gunTexture[i] = new PIXI.Texture(gunBase, new PIXI.Rectangle(i * 145, 0, 145, 145));
        }
        this.store('gun', gunTexture);

        var sprites: any = [[], [], []];
        var barrel = PIXI.BaseTexture.from('barrel'),
            greenlight = PIXI.BaseTexture.from('greenlight'),
            pillar = PIXI.BaseTexture.from('pillar');
        for (var x = 0; x < Config.texWidth; x++) {
            sprites[0][x] = new PIXI.Texture(barrel, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            sprites[1][x] = new PIXI.Texture(greenlight, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
            sprites[2][x] = new PIXI.Texture(pillar, new PIXI.Rectangle(x, 0, 1, Config.texHeight));
        }
        this.store('sprites', sprites);
    },
    store: function (name, resource) {
        this.pool[name] = resource;
    },
    get: function (name) {
        return this.pool[name];
    }
}