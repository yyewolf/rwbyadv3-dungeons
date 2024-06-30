import * as PIXI from "pixi.js";
import { Camera } from "./camera";
import { Key } from "./input";
import { UI } from "./ui";
import { Resources } from "./resources";
import { Config } from "./config";

export var Player = function (x, y, map) {
  this.position.x = x;
  this.position.y = y;
  this.map = map;
  this.powerHorizontal = 0;
  this.powerVertical = 0;
  // this.gun = new PIXI.Sprite(Resources.get('gun'));
  // UI.getLayer('gun').addChild(this.gun);
  // this.gun.position.y = Config.screenHeight - 140;
  // this.gun.position.x = (Config.screenWidth / 2);
  // this.gunPos = Config.screenHeight - 140;
  // this.gun.scale = { x: 1.5, y: 1.5 };
  // this.gun.animationSpeed = 0.28;
  // this.gun.loop = false;
  // this.gunDy = 0;

  // this.gun.onComplete = function () {
  //   setTimeout(function () {
  //     this.gunFiring = false;
  //   }.bind(this), 200);
  //   this.gun.gotoAndStop(0);
  // }.bind(this);
}

Player.prototype = new Camera(0, 0);
Player.prototype.constructor = Player;

Player.prototype.update = function (frameTime) {
  this.moveSpeed = frameTime * 3;
  this.rotSpeed = frameTime * 1.5;
  this.moveGun = false;
  // if (Key.isDown(Key.UP)) {
  //   this.moveGun = true;
  //   if (this.map.wallGrid[Math.floor(this.position.x + this.direction.x * this.moveSpeed * 4)]
  //   [Math.floor(this.position.y)] == false) {
  //     this.position.x += this.direction.x * this.moveSpeed;
  //   }
  //   if (this.map.wallGrid[Math.floor(this.position.x)]
  //   [Math.floor(this.position.y + this.direction.y * this.moveSpeed * 4)] == false) {
  //     this.position.y += this.direction.y * this.moveSpeed;
  //   }
  // }

  // if key is up rotate up
  if (Key.isDown(Key.UP)) {
    this.moveGun = true;
    if (this.map.wallGrid[Math.floor(this.position.x + this.direction.x * this.moveSpeed * 4)]
    [Math.floor(this.position.y)] == false) {
      this.position.x += this.direction.x * this.moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.position.x)]
    [Math.floor(this.position.y + this.direction.y * this.moveSpeed * 4)] == false) {
      this.position.y += this.direction.y * this.moveSpeed;
    }
  } else if (this.powerVertical > 0) {
    this.moveGun = true;
    let moveSpeed = this.moveSpeed * this.powerVertical;
    if (this.map.wallGrid[Math.floor(this.position.x + this.direction.x * moveSpeed * 4)]
    [Math.floor(this.position.y)] == false) {
      this.position.x += this.direction.x * moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.position.x)]
    [Math.floor(this.position.y + this.direction.y * moveSpeed * 4)] == false) {
      this.position.y += this.direction.y * moveSpeed;
    }
  }

  if (Key.isDown(Key.DOWN)) {
    this.moveGun = true;
    if (this.map.wallGrid[Math.floor(this.position.x - this.direction.x * this.moveSpeed * 4)]
    [Math.floor(this.position.y)] == false) {
      this.position.x -= this.direction.x * this.moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.position.x)]
    [Math.floor(this.position.y - this.direction.y * this.moveSpeed * 4)] == false) {
      this.position.y -= this.direction.y * this.moveSpeed;
    }
  } else if (this.powerVertical < 0) {
    this.moveGun = true;
    let moveSpeed = -this.moveSpeed * this.powerVertical;
    if (this.map.wallGrid[Math.floor(this.position.x - this.direction.x * moveSpeed * 4)]
    [Math.floor(this.position.y)] == false) {
      this.position.x -= this.direction.x * moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.position.x)]
    [Math.floor(this.position.y - this.direction.y * moveSpeed * 4)] == false) {
      this.position.y -= this.direction.y * moveSpeed;
    }
  }

  if (Key.isDown(Key.RIGHT)) {
    this.map.skybox.tilePosition.x -= 100 * frameTime;
    this.oldDirX = this.direction.x;
    this.direction.x = this.direction.x * Math.cos(-this.rotSpeed) - this.direction.y * Math.sin(-this.rotSpeed);
    this.direction.y = this.oldDirX * Math.sin(-this.rotSpeed) + this.direction.y * Math.cos(-this.rotSpeed);
    this.oldPlaneX = this.plane.x;
    this.plane.x = this.plane.x * Math.cos(-this.rotSpeed) - this.plane.y * Math.sin(-this.rotSpeed);
    this.plane.y = this.oldPlaneX * Math.sin(-this.rotSpeed) + this.plane.y * Math.cos(-this.rotSpeed);
  } else if (this.powerHorizontal > 0) {
    this.map.skybox.tilePosition.x -= 100 * frameTime;
    let rotSpeed = this.rotSpeed * this.powerHorizontal;
    this.oldDirX = this.direction.x;
    this.direction.x = this.direction.x * Math.cos(-rotSpeed) - this.direction.y * Math.sin(-rotSpeed);
    this.direction.y = this.oldDirX * Math.sin(-rotSpeed) + this.direction.y * Math.cos(-rotSpeed);
    this.oldPlaneX = this.plane.x;
    this.plane.x = this.plane.x * Math.cos(-rotSpeed) - this.plane.y * Math.sin(-rotSpeed);
    this.plane.y = this.oldPlaneX * Math.sin(-rotSpeed) + this.plane.y * Math.cos(-rotSpeed);
  }

  if (Key.isDown(Key.LEFT)) {
    this.map.skybox.tilePosition.x += 100 * frameTime;
    this.oldDirX = this.direction.x;
    this.direction.x = this.direction.x * Math.cos(this.rotSpeed) - this.direction.y * Math.sin(this.rotSpeed);
    this.direction.y = this.oldDirX * Math.sin(this.rotSpeed) + this.direction.y * Math.cos(this.rotSpeed);
    this.oldPlaneX = this.plane.x;
    this.plane.x = this.plane.x * Math.cos(this.rotSpeed) - this.plane.y * Math.sin(this.rotSpeed);
    this.plane.y = this.oldPlaneX * Math.sin(this.rotSpeed) + this.plane.y * Math.cos(this.rotSpeed);
  } else if (this.powerHorizontal < 0) {
    this.map.skybox.tilePosition.x += 100 * frameTime;
    let rotSpeed = - this.rotSpeed * this.powerHorizontal;
    this.oldDirX = this.direction.x;
    this.direction.x = this.direction.x * Math.cos(rotSpeed) - this.direction.y * Math.sin(rotSpeed);
    this.direction.y = this.oldDirX * Math.sin(rotSpeed) + this.direction.y * Math.cos(rotSpeed);
    this.oldPlaneX = this.plane.x;
    this.plane.x = this.plane.x * Math.cos(rotSpeed) - this.plane.y * Math.sin(rotSpeed);
    this.plane.y = this.oldPlaneX * Math.sin(rotSpeed) + this.plane.y * Math.cos(rotSpeed);
  }

  // log player position
  let spriteRadius = 0.3;

  this.map.sprites.forEach(sprite => {
    if (Math.abs(this.position.x - sprite.x) < spriteRadius && Math.abs(this.position.y - sprite.y) < spriteRadius) {
      this.map.sprites.splice(this.map.sprites.indexOf(sprite), 1);
    }
  });
};