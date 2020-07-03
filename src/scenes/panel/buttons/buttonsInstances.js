import {Button} from "../../../Button";
import {game} from "../../../Config";

class AutoPlayButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'autoPlayBtn', scale, frame);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].updateButtonsFrames('autoPlay', !game.scene.keys['Panel'].buttonsClicked.autoPlay);
                game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);
            }
        })
    }
}

class SpinButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'spinBtn', scale, frame);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                if (game.scene.keys['Panel'].buttonsClicked.spin) {
                    game.scene.keys['Slots'].allowStart();
                    game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);
                    game.scene.keys['Panel'].updateButtonsFrames('spin', false);
                }

                if (!game.scene.keys['Panel'].buttonsClicked.spin && game.scene.keys['Slots'].allowRepeatSpin()) {
                    game.scene.keys['Slots'].allowStart();
                    game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);
                    game.scene.keys['Panel'].updateButtonsFrames('spin', true);
                }
            }
        })
    }
}

class DecreaseButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'decreaseBtn', scale, frame);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].setBet(false);
            }
        })
    }
}

class IncreaseButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'increaseBtn', scale, frame);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].setBet(true);
            }
        })
    }
}

class InfoButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'infoBtn', scale, frame);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(!game.scene.keys['Panel'].buttonsClicked.info);
                game.scene.keys['Musics'].sounds[game.scene.keys['Panel'].buttonsClicked.info ? 'openSettings' : 'closeSettings']();
            }
        })
    }
}

class DenomButtons extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'denomButtons', scale, frame);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['MainWindow'].toggleTitlesVisibility(false);
                game.scene.keys['Denom'].togglePageVisibility(true);
                game.scene.keys['Slots'].togglePageVisibility(false);
                scene.togglePanelVisibility(false);
            }
        })
    }
}

class VolumeButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'volumeBtn', scale, frame);

        this.on('pointerup', () => {
            game.scene.keys['Panel'].updateVolumeFrame();
            game.scene.keys['Musics'].setVolume(game.scene.keys['Panel'].buttonsClicked.volumeFrame);
        })
    }
}

class GameRulesButton extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'gameRules', scale, frame);

        this.on('pointerup', () => {
            scene.togglePanelVisibility(false);
            game.scene.keys['Slots'].togglePageVisibility(false);
            game.scene.keys['Rules'].togglePageVisibility(true);

            game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);

            game.scene.keys['MainWindow'].hideJackPotsImages(false);
            game.scene.keys['MainWindow'].changeTitlesVisibility(0);
        })
    }
}

const classes = {
    AutoPlayButton,
    SpinButton,
    DecreaseButton,
    IncreaseButton,
    InfoButton,
    DenomButtons,
    VolumeButton,
    GameRulesButton
};

export {classes};
