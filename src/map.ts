import { Mesh3D, Model, StandardMaterial } from "pixi3d/pixi7"
import { Game } from "./game"
import { Loot, MoneyBag } from "./loots"

export class Map {
  game: Game

  walls: number[][] = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ]
  loots: Loot[] = []
  objects: Mesh3D[][][] = []

  constructor(game: Game, data: any) {
    this.walls = data.grid
    this.game = game

    this.loots = data.loots.map((loot: any) => {
      switch (loot.type) {
        case "money":
          return new MoneyBag(loot)
      }
    })

    this.generate = this.generate.bind(this)

    this.generate()
  }

  private generate() {
    for (let i = 0; i < this.walls.length; i++) {
      this.objects.push([])
      for (let j = 0; j < this.walls[i].length; j++) {
        this.objects[i][j] = []
        if (this.walls[i][j] === 1) {
          let wall = this.game.app.stage.addChild(Mesh3D.createCube())
          wall.position.set((j - this.walls[i].length) * 2, 0, (i - this.walls.length) * 2)
          wall.scale.set(1, 1, 1)

          wall.rotationQuaternion.setEulerAngles(90, 0, 0)
          let mat = wall.material as StandardMaterial

          mat.baseColorTexture = this.game.resources.wood.baseColor
          mat.normalTexture = this.game.resources.wood.normal
          mat.metallicRoughnessTexture = this.game.resources.wood.roughness
          mat.emissiveTexture = this.game.resources.wood.emissive

          this.objects[i][j].push(wall)
        } else {
          // add floor
          let floor = this.game.app.stage.addChild(Mesh3D.createPlane())
          floor.position.set((j - this.walls[i].length) * 2, -1, (i - this.walls.length) * 2)
          floor.scale.set(1, 1, 1)
          let mat = floor.material as StandardMaterial
          mat.baseColorTexture = this.game.resources.stone.baseColor
          mat.normalTexture = this.game.resources.stone.normal
          mat.occlusionTexture = this.game.resources.stone.occlusion
          mat.emissiveTexture = this.game.resources.stone.emissive

          // add ceiling
          let ceiling = this.game.app.stage.addChild(Mesh3D.createPlane())
          ceiling.position.set((j - this.walls[i].length) * 2, 1, (i - this.walls.length) * 2)
          ceiling.scale.set(1, 1, 1)
          ceiling.rotationQuaternion.setEulerAngles(180, 0, 0)

          mat = ceiling.material as StandardMaterial
          mat.baseColorTexture = this.game.resources.wood.baseColor
          mat.normalTexture = this.game.resources.wood.normal
          mat.metallicRoughnessTexture = this.game.resources.wood.roughness
          mat.emissiveTexture = this.game.resources.wood.emissive

          this.objects[i][j].push(floor)
          this.objects[i][j].push(ceiling)
        }
      }
    }

    // Add a money bags
    for (let i = 0; i < this.loots.length; i++) {
      let loot = this.loots[i]
      let model = loot.model(this.game.resources)
      let object = this.game.app.stage.addChild(model)
      loot.place(object, (loot.x - this.walls.length) * 2, (loot.y - this.walls.length) * 2)
    }
  }
}