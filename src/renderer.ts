import * as PIXI from "pixi.js";
import { Key } from "./input";
import { UI } from "./ui";
import { Resources } from "./resources";
import { Config } from "./config";

/* Declaring all the variables outside of the loop is more efficient, 
   and works well with the original c++ code which is very procedural
   DON'T WORRY - as we're using browserify these will be scoped to
   this module */
let rayIdx, cameraX, rayPosX, rayPosY, rayDirX, rayDirY, mapX, mapY,
  sideDistX, sideDistY, deltaDistX, deltaDistY, perpWallDist, stepX,
  stepY, hit, side, lineHeight, drawStart, drawEnd, color, time = 0,
  oldTime = 0, frameTime, tint, zBuffer = [], spriteOrder = [],
  spriteDistance = [], spriteIdx, wallX, texNum, posX, posY, shadowDepth;

shadowDepth = 12;

export function update(camera) {
  drawWalls(camera, camera.map);
  drawSprites(camera, camera.map);
  // calculate delta time
  oldTime = time;
  time = performance.now();
  frameTime = (time - oldTime) / 1000;
  camera.update(frameTime);
}

export function drawWalls(camera, map) {
  for (rayIdx = 0; rayIdx < Config.screenWidth; rayIdx++) {
    cameraX = 2 * rayIdx / Config.screenWidth - 1;
    rayPosX = camera.position.x;
    rayPosY = camera.position.y;
    rayDirX = camera.direction.x + camera.plane.x * cameraX;
    rayDirY = camera.direction.y + camera.plane.y * cameraX;
    // Which box we're in
    mapX = Math.floor(rayPosX);
    mapY = Math.floor(rayPosY);
    // Length of ray from current pos to next x or y side
    deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) /
      (rayDirX * rayDirX));
    deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) /
      (rayDirY * rayDirY));
    // was there a wall hit?
    hit = 0;
    // calculate step and initial sideDist
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (rayPosX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - rayPosX) * deltaDistX;
    }

    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (rayPosY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - rayPosY) * deltaDistY;
    }

    while (hit == 0) {
      // jump to next map square
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      // check if ray has hit a wall
      if (map.wallGrid[Math.round(mapX)][Math.round(mapY)] > 0) {
        hit = 1;
      }
    }
    // calculate distance projected
    if (side == 0) {
      perpWallDist = Math.abs((mapX - rayPosX + (1 - stepX) / 2) /
        rayDirX);
    } else {
      perpWallDist = Math.abs((mapY - rayPosY + (1 - stepY) / 2) /
        rayDirY);
    }
    // calculate height of line
    lineHeight = Math.abs(Math.round(Config.screenHeight / perpWallDist));
    // calculate lowest and highest pixel to fill in
    drawStart = -lineHeight / 2 + Config.screenHeight / 2;
    drawEnd = lineHeight / 2 + Config.screenHeight / 2;

    if (side == 1) {
      wallX = rayPosX + ((mapY - rayPosY + (1 - stepY) / 2) / rayDirY) * rayDirX;
    } else {
      wallX = rayPosY + ((mapX - rayPosX + (1 - stepX) / 2) / rayDirX) * rayDirY;
    }
    wallX -= Math.floor(wallX);
    // grab the sprite for this wall slice
    var line = UI.getLayer('walls').children[rayIdx];
    // the x co-ordinate of the slice of wall texture
    var texX = Math.floor(wallX * Config.texWidth);
    if (side == 0 && rayDirX > 0) {
      texX = Config.texWidth - texX - 1;
    }
    if (side == 1 && rayDirY < 0) {
      texX = Config.texWidth - texX - 1;
    }
    // Pixi has easy tinting with hex values, let's use this to build a primitive
    // lighting system. Start out with a white (invisible) tint
    tint = 0xFFFFFF;
    if (side == 1) {
      // give one orientation of wall a darker tint for contrast
      tint -= 0x444444;
    }
    // also tint the slice darker, the further away it is
    // increase shadowDepth to make the level darker
    tint -= (0x010101 * Math.round(perpWallDist * shadowDepth));

    if (tint <= 0x000000) {
      tint = 0x000000;
    }
    // apply the tint
    line.tint = tint;
    // grab the texture for the index in the map grid
    texNum = map.wallGrid[mapX][mapY] - 1;
    // Grab the texture slice (these are presliced on load so 
    // no need for pixel buffer antics)
    // line.setTexture(Resources.get('texture')[texNum][texX]);
    line.texture = Resources.get('texture')[texNum][texX];
    line.position.y = drawStart;
    line.height = drawEnd - drawStart;

    // store z dist for sprites!
    zBuffer[rayIdx] = perpWallDist;
  }

  map.sprites.sort(function (a, b) {
    var distanceA = ((posX - a.x) * (posX - a.x) + (posY - a.y) * (posY - a.y));
    var distanceB = ((posX - b.x) * (posX - b.x) + (posY - b.y) * (posY - b.y));
    if (distanceA < distanceB) {
      return -1
    }
    if (distanceA > distanceB) {
      return 1;
    }
    return 0;
  });
}

export function drawSprites(camera, map) {
  const spriteLayer = UI.getLayer('sprites');

  // Clear the sprite layer
  spriteLayer.removeChildren();

  // Sort sprites by distance from the camera
  map.sprites.sort((a, b) => {
    const distA = ((camera.position.x - a.x) ** 2 + (camera.position.y - a.y) ** 2);
    const distB = ((camera.position.x - b.x) ** 2 + (camera.position.y - b.y) ** 2);
    return distB - distA;
  });

  // Process each sprite
  map.sprites.forEach(sprite => {
    const spriteTexture = Resources.get('sprites')[0];
    const spriteX = sprite.x
    const spriteY = sprite.y

    // Check if the sprite is in the player's field of view
    const transformX = spriteX - camera.position.x
    const transformY = spriteY - camera.position.y

    const invDet = 1.0 / (camera.plane.x * camera.direction.y - camera.direction.x * camera.plane.y)
    const transformXScreen = invDet * (camera.direction.y * transformX - camera.direction.x * transformY)
    const transformYScreen = invDet * (-camera.plane.y * transformX + camera.plane.x * transformY)

    // ignore if it is behind the player
    if (transformYScreen <= 0) {
      return;
    }

    const spriteScreenX = Math.floor((Config.screenWidth / 2) * (1 + transformXScreen / transformYScreen))
    const spriteHeight = Math.abs(Math.floor(Config.screenHeight / transformYScreen)) * 0.5
    const drawStartY = -spriteHeight / 2 + Config.screenHeight / 2
    const drawEndY = spriteHeight / 2 + Config.screenHeight / 2
    const spriteWidth = Math.abs(Math.floor(Config.screenHeight / transformYScreen)) * 0.5
    const drawStartX = -spriteWidth / 2 + spriteScreenX
    const drawEndX = spriteWidth / 2 + spriteScreenX

    // Check if we should draw it
    if (drawStartX > Config.screenWidth || drawEndX < 0 || drawStartY > Config.screenHeight || drawEndY < 0) {
      return;
    }
    if (drawStartX < 0 && drawEndX > Config.screenWidth) {
      return;
    }
    if (drawStartY < 0 && drawEndY > Config.screenHeight) {
      return;
    }

    // Check against zBuffer
    for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
      // Check if we're in bounds
      if (stripe < 0 || stripe >= Config.screenWidth) {
        continue;
      }

      rayIdx = Math.floor(stripe);

      // Check the dist from the wall
      let perpWallDist = zBuffer[rayIdx];
      let perpLineDist = transformYScreen;
      if (perpLineDist > perpWallDist) {
        continue;
      }

      // Calculate height of the sprite
      let lineHeight = Math.abs(Math.floor(Config.screenHeight / perpLineDist)) * 0.5;

      let drawStart = (-lineHeight / 2 + Config.screenHeight / 2);
      let drawEnd = (lineHeight / 2 + Config.screenHeight / 2);

      // offset drawStart and drawEnd to draw closer to the floor
      drawStart += lineHeight / 2;
      drawEnd += lineHeight / 2;

      let texX = Math.floor((stripe - drawStartX) / spriteWidth * Config.texWidth);

      // Draw this vertical line
      let spriteLine = new PIXI.Sprite();
      // Set texture
      spriteLine.texture = spriteTexture[texX];
      spriteLine.position.x = stripe;
      spriteLine.position.y = drawStart;
      spriteLine.height = drawEnd - drawStart;
      spriteLayer.addChild(spriteLine);
    }
  });
} 