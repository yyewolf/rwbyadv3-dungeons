import * as PIXI from "pixi.js";
import { Camera } from "./camera";
import { Key } from "./input";
import { UI } from "./ui";
import { Resources } from "./resources";
import { Config } from "./config";

export var Player = function (x, y, map) {
  this.position.x = x;
  this.position.y = y;
  this.position.pitch = 0;
  this.map = map;
  this.powerHorizontal = 0;
  this.powerVertical = 0;

  this.offset = {
    x: 0,
    y: 0,
  }

  this.getMapPosition = function () {
    return {
      x: this.position.x - this.offset.x,
      y: this.position.y - this.offset.y,
    }
  }

  this.goForward = function (power: number) {
    this.moveGun = true;
    let moveSpeed = this.moveSpeed * power;
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x + this.direction.x * moveSpeed * 4)]
    [Math.floor(this.getMapPosition().y)] == false) {
      this.position.x += this.direction.x * moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x)]
    [Math.floor(this.getMapPosition().y + this.direction.y * moveSpeed * 4)] == false) {
      this.position.y += this.direction.y * moveSpeed;
    }
  }

  this.goSideways = function (power: number) {
    this.moveGun = true;
    let moveSpeed = this.moveSpeed * power;
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x + this.direction.y * moveSpeed * 4)]
    [Math.floor(this.getMapPosition().y)] == false) {
      this.position.x += this.direction.y * moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x)]
    [Math.floor(this.getMapPosition().y - this.direction.x * moveSpeed * 4)] == false) {
      this.position.y -= this.direction.x * moveSpeed;
    }
  }
}

Player.prototype = new Camera(0, 0);
Player.prototype.constructor = Player;

Player.prototype.update = function (frameTime) {
  this.moveSpeed = frameTime * 3;
  this.rotSpeed = frameTime * 1.5;
  this.moveGun = false;

  if (Key.isDown(Key.Z) || Key.isDown(Key.W)) {
    this.goForward(1);
  } else if (this.powerVertical > 0) {
    this.goForward(this.powerVertical);
  }

  if (Key.isDown(Key.S)) {
    this.goForward(-1);
  } else if (this.powerVertical < 0) {
    this.goForward(this.powerVertical);
  }

  if (Key.isDown(Key.D)) {
    this.goSideways(1);
  } else if (this.powerHorizontal > 0) {
    this.goSideways(this.powerHorizontal);
  }

  if (Key.isDown(Key.A) || Key.isDown(Key.Q)) {
    this.goSideways(-1);
  } else if (this.powerHorizontal < 0) {
    this.goSideways(this.powerHorizontal);
  }

  // log player position
  let spriteRadius = 0.3;

  this.map.sprites.forEach(sprite => {
    if (Math.abs(this.getMapPosition().x - sprite.x) < spriteRadius && Math.abs(this.getMapPosition().y - sprite.y) < spriteRadius) {
      this.map.sprites.splice(this.map.sprites.indexOf(sprite), 1);
    }
  });
};