import { Config } from "./config";
import { UI } from "./ui";
import * as PIXI from "pixi.js";

export function Map(wallGrid) {
  this.wallGrid = wallGrid;
  this.sprites = [
    { x: 2, y: 2, tex: 7 },
  ];
  this.skyTexture = PIXI.Texture.from('skybox');
  this.skybox = new PIXI.TilingSprite(this.skyTexture, Config.screenWidth, Config.screenHeight / 2);
  // console.log(this.skybox);
  // this.skybox.generateTilingTexture(false);
  this.skybox.alpha = 0.6;
  this.skybox.tileScale = { x: 0.5, y: 0.4 };
  UI.getLayer('skybox').addChild(this.skybox);

  this.offset = {
    x: 0,
    y: 0,
  }

  this.onUpdate = (wallGrid, offset) => {
    this.wallGrid = wallGrid;
    this.offset = offset;
  }
}