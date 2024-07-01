declare var require: any; // parcel/typescript workaround.

import * as PIXI from "pixi.js";
import { Camera } from "./camera";
import { Key } from "./input";
import { UI } from "./ui";
import { Resources } from "./resources";
import { Config } from "./config";
import { Map } from "./map";
import { update } from "./renderer";
import { Player } from "./player";
import { Direction, Joystick } from "../lib/joystick.ts";

PIXI.Loader.shared
  .add('redbrick', require("../assets/redbrick.png"))
  .add('pistol', require("../assets/pistol.png"))
  .add('skybox', require("../assets/skybox.png"))
  .add('wood', require("../assets/wood.png"))
  .add('purplestone', require("../assets/purplestone.png"))
  .add('mossy', require("../assets/mossy.png"))
  .add('greystone', require("../assets/greystone.png"))
  .add('bluestone', require("../assets/bluestone.png"))
  .add('eagle', require("../assets/eagle.png"))
  .add('colorstone', require("../assets/colorstone.png"))
  .add('barrel', require("../assets/barrel.png"))
  .add('greenlight', require("../assets/greenlight.png"))
  .add('pillar', require("../assets/pillar.png"))
  .add('transparent', require("../assets/transparent.png"))
  .add('joystick', require("../assets/joystick.png"))
  .add('joystick-handle', require("../assets/joystick-handle.png"))
  .add('crosshair', require("../assets/crosshair.png"))
  .load(start);

async function start() {
  const app = new PIXI.Application({
    view: document.getElementById('canvas') as HTMLCanvasElement,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });
  let renderer = app.renderer;
  let stage = app.stage;

  renderer.view.className = 'game';

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
  }

  // Init textures
  Resources.init();
  // add layers (DOCs)
  UI.addLayer(app, 'skybox');
  UI.addLayer(app, 'walls');
  UI.addLayer(app, 'sprites');
  UI.addLayer(app, 'gun');
  UI.addLayer(app, 'hud');

  var sprite, walls = UI.getLayer('walls');
  // Create wall 'slice' sprites (ie rays)

  let resp = await fetch('map')
  let wallGrid = await resp.json()

  var map = new Map(wallGrid);
  var player = new Player(3, 3, map);

  requestAnimationFrame(animate);
  setInterval(function () {
    update(player);
  }, 1000 / 60);

  const leftJoystick = new Joystick({
    outer: PIXI.Sprite.from('joystick'),
    inner: PIXI.Sprite.from('joystick-handle'),
    outerScale: { x: 0.5, y: 0.5 },
    innerScale: { x: 0.8, y: 0.8 },
    onChange: (data) => {
      // convert to rad
      let angle = data.angle * Math.PI / 180;
      let powerX = data.power * Math.cos(angle);
      let powerY = data.power * Math.sin(angle);

      player.powerVertical = powerY;
      player.powerHorizontal = powerX;
    },
    onStart: () => console.log('start'),
    onEnd: () => {
      player.powerVertical = 0;
      player.powerHorizontal = 0;
    },
  });
  app.stage.addChild(leftJoystick);

  // Add crosshair to HUD
  const crosshair = PIXI.Sprite.from('crosshair');
  crosshair.anchor.set(0.5);
  crosshair.position.set(window.innerWidth / 2, window.innerHeight / 2);
  crosshair.scale.set(0.02);
  UI.getLayer('hud').addChild(crosshair);


  const resize = () => {
    leftJoystick.position.set(leftJoystick.width, window.innerHeight - leftJoystick.height);

    // crosshair
    crosshair.position.set(window.innerWidth / 2, window.innerHeight / 2);

    // Delete rays
    let newWalls = walls;
    for (var i = 0; i < newWalls.children.length; i++) {
      if (newWalls.children[i].ray) {
        newWalls.removeChild(newWalls.children[i]);
        i--;
      }
    }

    for (var x = 0; x < Config.screenWidth; x++) {
      sprite = new PIXI.Sprite(Resources.get('texture')[0][4]);
      sprite.position.x = x;
      sprite.ray = true;
      newWalls.addChild(sprite);
    }
    walls = newWalls;

    map.skybox.width = Config.screenWidth;
    map.skybox.height = Config.screenHeight / 2;

    Config.screenHeight = window.innerHeight;
    Config.screenWidth = window.innerWidth;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.resize();
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    setTimeout(resize, 100)
  });

  let handleCamera = (e) => {
    // if finger is on joystick, don't move camera
    if (leftJoystick.dragging && leftJoystick.pointerId === e.pointerId) {
      console.log('joystick')
      return;
    }

    // new pitch
    player.position.pitch -= e.movementY * 3;

    // new dir
    player.oldDirX = player.direction.x;
    player.direction.x = player.direction.x * Math.cos(-e.movementX * 0.01) - player.direction.y * Math.sin(-e.movementX * 0.01);
    player.direction.y = player.oldDirX * Math.sin(-e.movementX * 0.01) + player.direction.y * Math.cos(-e.movementX * 0.01);

    // new plane
    player.oldPlaneX = player.plane.x;
    player.plane.x = player.plane.x * Math.cos(-e.movementX * 0.01) - player.plane.y * Math.sin(-e.movementX * 0.01);
    player.plane.y = player.oldPlaneX * Math.sin(-e.movementX * 0.01) + player.plane.y * Math.cos(-e.movementX * 0.01);
  }
  let canvas = document.getElementById('canvas');
  canvas?.addEventListener('click', () => {
    // canvas?.requestPointerLock()
  });
  canvas?.addEventListener('pointermove', handleCamera, false);
  canvas?.addEventListener('pointerdown', (e) => {
    // if near joystick, don't move camera set pointerId
    let boxSize = leftJoystick.width + 50;
    let joystickCenter = {
      x: leftJoystick.position.x + leftJoystick.width / 2,
      y: leftJoystick.position.y + leftJoystick.height / 2,
    }
    if (e.clientX > joystickCenter.x - boxSize && e.clientX < joystickCenter.x + boxSize && e.clientY > joystickCenter.y - boxSize && e.clientY < joystickCenter.y + boxSize) {
      console.log(e)
      leftJoystick.pointerId = e.pointerId;
    }
  }, false);

  app.start();
}

