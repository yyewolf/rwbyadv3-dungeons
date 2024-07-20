import { Container, Text, TextStyle } from "pixi.js";
import { Game } from "./game";
import { Graphics } from "@pixi/graphics";

export class Loading extends Container {
    game: Game
    progressText: Text
    background: Graphics
    filler: Graphics

    constructor(game: Game) {
        super();

        this.game = game;

        this.background = new Graphics()
            .beginFill('#FFFFFF')
            .drawRoundedRect(0, 0, this.game.app.screen.width * 0.75, (this.game.app.screen.height * 0.1), 10)
            .beginFill('#4cd137')
            .drawRoundedRect(2, 2, (this.game.app.screen.width * 0.75) - (2 * 2), (this.game.app.screen.height * 0.1) - (2 * 2), 10)

        this.filler = new Graphics()
            .beginFill('#FFFFFF')
            .drawRoundedRect(0, 0, (this.game.app.screen.width * 0.75), (this.game.app.screen.height * 0.1), 10)
            .beginFill('#e55039')
            .drawRoundedRect(2, 2, (this.game.app.screen.width * 0.75) - (2 * 2), (this.game.app.screen.height * 0.1) - (2 * 2), 10)

        const loadingTxtStyle = new TextStyle({ fontWeight: 'bold' })

        this.background.position.set(
            this.width / 2,
            this.height / 2
        )
        this.filler.position.set(
            this.width / 2,
            this.height / 2
        )
        this.filler.width = 0

        this.progressText = new Text('', loadingTxtStyle)
        this.progressText.position.set(
            this.width / 2,
            this.height + 30
        )

        if (window.matchMedia("(orientation: portrait)").matches) {
            this.rotation = Math.PI / 2;
            this.position.set(this.y, this.x)
        }

        // @ts-ignore
        this.addChild(this.progressText, this.background, this.filler)
        this.pivot.set(
            this.width / 2,
            this.height / 2
        )

        this.position.x = this.game.app.screen.width / 2
        this.position.y = this.game.app.screen.height / 2

        this.setProgress = this.setProgress.bind(this)
    }

    setProgress(progress: number) {
        this.filler.width = this.width * progress
        this.progressText.text = `${progress * 100}%`
        this.progressText.x = this.width / 2 - this.progressText.width / 2
    }
}