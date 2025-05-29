import { Application } from "pixi.js";
import { Player } from "./player";
import { Hud } from "./hud";
import { Map } from "./map";
import { Resources } from "./resources";
import { Inputs } from "./inputs";
import { Camera } from "pixi3d/pixi7";
import { Notification } from "./notification";
import { Loading } from "./loading";

export class Game {
  app: Application;
  resources: Resources;
  inputsController: Inputs;
  map: Map;
  player: Player;
  hud?: Hud;
  dungeonId: string | null;

  constructor(app: Application) {
    this.app = app;

    this.resources = new Resources();
    this.inputsController = new Inputs();
    this.map = new Map(this, { grid: [], loots: [] });
    this.player = new Player(this, Camera.main);
    this.dungeonId = null;

    this.update = this.update.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  async initialize() {
    let progressBar = new Loading(this);
    this.app.stage.addChild(progressBar);
    this.resources.onProgress = progressBar.setProgress;
    await this.resources.initialize();

    // Get dungeonId from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    this.dungeonId = urlParams.get("dungeonId");

    if (!this.dungeonId) {
      // Redirect to error page if dungeonId is missing
      window.location.href = "/landing/error/?error=dungeon_not_found";
      return;
    }

    try {
      const response = await fetch("/dungeons/api/dungeon/" + this.dungeonId);

      if (!response.ok) {
        // Redirect to error page if the API returns an error
        window.location.href = "/landing/error/?error=dungeon_not_found";
        return;
      }

      const data = await response.json();
      this.map = new Map(this, data);
      this.map.generate();
    } catch (error) {
      console.error("Error loading dungeon:", error);
      window.location.href = "/landing/error/?error=dungeon_not_found";
      return;
    }

    this.player = new Player(this, Camera.main);
    this.player.initialize();

    this.hud = new Hud(this);

    this.app.stage.removeChild(progressBar);
  }

  public bindEvents() {
    let that = this;
    window.addEventListener(
      "keyup",
      function (event) {
        that.inputsController.onKeyup(event);

        // if it's J,
        if (event.keyCode === 74) {
          // create new notification
          new Notification(that, {
            message: "Welcome to the dungeon!",
            time: 5,
          });
        }
        // if it's K,
        if (event.keyCode === 75) {
          // create new notification
          that.endGame();
        }
      },
      false
    );
    window.addEventListener(
      "keydown",
      function (event) {
        that.inputsController.onKeydown(event);
      },
      false
    );
    // @ts-ignore
    this.app.view.addEventListener("click", () =>
      // @ts-ignore
      that.app.view.requestPointerLock()
    );
    window.addEventListener("resize", () => {
      that.app.renderer.resize(window.innerWidth, window.innerHeight);
      that.hud?.onResize();
    });
    window.addEventListener(
      "pointerdown",
      (e) => that.hud?.onPointerDown(e),
      false
    );
    window.addEventListener(
      "pointerup",
      (e) => that.hud?.onPointerUp(e),
      false
    );
    window.addEventListener(
      "pointermove",
      function (event) {
        if (that.hud?.joystick.pointerId !== event.pointerId) {
          that.player?.handlePointerMove(event);
        }
      },
      false
    );
  }

  public update() {
    this.player.update();
    this.hud?.update();
    requestAnimationFrame(this.update);
  }

  public async endGame() {
    this.endGame = async () => {};
    this.player.endGame();
    this.hud?.endGame();

    // free the pointer
    document.exitPointerLock();

    // Use the stored dungeonId
    if (!this.dungeonId) {
      console.error("Missing dungeonId");
      window.location.href = "/landing/error/?error=dungeon_not_found";
      return;
    }

    // send end request
    try {
      const response = await fetch(
        "/dungeons/api/dungeon/" + this.dungeonId + "/end",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.player.response),
        }
      );

      if (!response.ok) {
        console.error("Error ending dungeon: server returned", response.status);
        window.location.href = "/landing/error/?error=dungeon_not_found";
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error ending dungeon:", error);
      window.location.href = "/landing/error/?error=dungeon_not_found";
    }
  }
}
