import { Application } from "pixi.js"
import { Mesh3D, StandardMaterial } from "pixi3d/pixi7"

export class Map {
  app: Application
  walls: number[][] = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ]
  objects: Mesh3D[][][] = []
  assets: any

  constructor(app: Application, assets: any, walls: number[][]) {
    this.walls = walls
    this.assets = assets
    this.app = app

    this.generate()
  }

  private generate() {
    for (let i = 0; i < this.walls.length; i++) {
      this.objects.push([])
      for (let j = 0; j < this.walls[i].length; j++) {
        this.objects[i][j] = []
        if (this.walls[i][j] === 1) {
          let wall = this.app.stage.addChild(Mesh3D.createCube())
          wall.position.set((j - this.walls[i].length) * 2, 0, (i - this.walls.length) * 2)
          wall.scale.set(1, 1, 1)

          wall.rotationQuaternion.setEulerAngles(90, 0, 0)
          let mat = wall.material as StandardMaterial
          console.log(this.assets)
          mat.baseColorTexture = this.assets.baseColor
          mat.normalTexture = this.assets.normal
          mat.metallicRoughnessTexture = this.assets.roughness
          mat.emissiveTexture = this.assets.emissive

          this.objects[i][j].push(wall)
        } else {
          // add floor
          let floor = this.app.stage.addChild(Mesh3D.createPlane())
          floor.position.set((j - this.walls[i].length) * 2, -1, (i - this.walls.length) * 2)
          floor.scale.set(1, 1, 1)
          let mat = floor.material as StandardMaterial
          mat.baseColorTexture = this.assets.baseColor
          mat.normalTexture = this.assets.normal
          mat.metallicRoughnessTexture = this.assets.roughness
          mat.emissiveTexture = this.assets.emissive

          // add ceiling
          let ceiling = this.app.stage.addChild(Mesh3D.createPlane())
          ceiling.position.set((j - this.walls[i].length) * 2, 1, (i - this.walls.length) * 2)
          ceiling.scale.set(1, 1, 1)
          ceiling.rotationQuaternion.setEulerAngles(180, 0, 0)

          mat = ceiling.material as StandardMaterial
          mat.baseColorTexture = this.assets.baseColor
          mat.normalTexture = this.assets.normal
          mat.metallicRoughnessTexture = this.assets.roughness
          mat.emissiveTexture = this.assets.emissive

          this.objects[i][j].push(floor)
          this.objects[i][j].push(ceiling)
        }
      }
    }
  }
}