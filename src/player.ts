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
}

Player.prototype = new Camera(0, 0);
Player.prototype.constructor = Player;

Player.prototype.update = function (frameTime) {
  this.moveSpeed = frameTime * 3;
  this.rotSpeed = frameTime * 1.5;
  this.moveGun = false;

  if (Key.isDown(Key.UP)) {
    this.moveGun = true;
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x + this.direction.x * this.moveSpeed * 4)]
    [Math.floor(this.getMapPosition().y)] == false) {
      this.position.x += this.direction.x * this.moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x)]
    [Math.floor(this.getMapPosition().y + this.direction.y * this.moveSpeed * 4)] == false) {
      this.position.y += this.direction.y * this.moveSpeed;
    }
  } else if (this.powerVertical > 0) {
    this.moveGun = true;
    let moveSpeed = this.moveSpeed * this.powerVertical;
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x + this.direction.x * moveSpeed * 4)]
    [Math.floor(this.getMapPosition().y)] == false) {
      this.position.x += this.direction.x * moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x)]
    [Math.floor(this.getMapPosition().y + this.direction.y * moveSpeed * 4)] == false) {
      this.position.y += this.direction.y * moveSpeed;
    }
  }

  if (Key.isDown(Key.DOWN)) {
    this.moveGun = true;
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x - this.direction.x * this.moveSpeed * 4)]
    [Math.floor(this.getMapPosition().y)] == false) {
      this.position.x -= this.direction.x * this.moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x)]
    [Math.floor(this.getMapPosition().y - this.direction.y * this.moveSpeed * 4)] == false) {
      this.position.y -= this.direction.y * this.moveSpeed;
    }
  } else if (this.powerVertical < 0) {
    this.moveGun = true;
    let moveSpeed = -this.moveSpeed * this.powerVertical;
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x - this.direction.x * moveSpeed * 4)]
    [Math.floor(this.getMapPosition().y)] == false) {
      this.position.x -= this.direction.x * moveSpeed;
    }
    if (this.map.wallGrid[Math.floor(this.getMapPosition().x)]
    [Math.floor(this.getMapPosition().y - this.direction.y * moveSpeed * 4)] == false) {
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
    if (Math.abs(this.getMapPosition().x - sprite.x) < spriteRadius && Math.abs(this.getMapPosition().y - sprite.y) < spriteRadius) {
      this.map.sprites.splice(this.map.sprites.indexOf(sprite), 1);
    }
  });
};