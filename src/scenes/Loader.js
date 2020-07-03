import {gameWidth as width, height, offsetX, frameElems, fireBalls, isMobile} from "../Config";

class Loader extends Phaser.Scene {
    constructor() {
        super('Loader');
    }

    preload() {
        const progressBorder = this.add.graphics().setDepth(100)
            .lineStyle(2, 0x464646, 1)
            .strokeRect(offsetX - 300, height / 2 + 200, 600, 10);
        const bgProgress = this.add.graphics({fillStyle: {color: 0x00001e}})
            .fillRect(0, 0, width, height);
        const progressBox = this.add.graphics({fillStyle: {color: 0x7aa838}});

        this.load.on('progress', (value) => {
            progressBox.clear();
            progressBox.fillRect(offsetX - 298, height / 2 + 203, 596 * value, 5);
        });

        this.load.on('complete', () => {
            progressBorder.destroy();
            progressBox.destroy();
            bgProgress.destroy();
        });



        ////////////////////////////////////////////////////////////////////
        // Rules
        ////////////////////////////////////////////////////////////////////

        Array.from({length: 4}, (_, index) => {
            this.load.image(`page_${index + 1}`, `assets/rules/${index + 1}.png`);
        });

        this.load.image('rulesButtonsBg', 'assets/buttons/rulesButtons.png');
        this.load.image('previousPage', 'assets/buttons/previousPage.png');
        this.load.image('returnToGame', 'assets/buttons/returnToGame.png');
        this.load.image('nextPage', 'assets/buttons/nextPage.png');

        ////////////////////////////////////////////////////////////////////
        // FreeGames
        ////////////////////////////////////////////////////////////////////

        this.load.multiatlas('freeGamesFrame', 'assets/freeGames/frame/frame.json', 'assets/freeGames/frame');
        this.load.multiatlas('freeGamesMoneyDisplay', 'assets/freeGames/moneyDisplay/moneyDisplay.json', 'assets/freeGames/moneyDisplay');
        this.load.multiatlas('freeGamesText', 'assets/freeGames/freeGamesText/freeGamesText.json', 'assets/freeGames/freeGamesText');
        this.load.multiatlas('freeGames', 'assets/elements/freeGames/freeGames.json', 'assets/elements/freeGames');
        this.load.multiatlas('confetti', 'assets/freeGames/confetti/confetti.json', 'assets/freeGames/confetti');
        this.load.image('freeGamesBar', 'assets/freeGamesBar.png');
        this.load.image('frameWithoutBg', 'assets/freeGames/frame/frameWithoutBg.png');
        this.load.image('totalBonusWin', 'assets/freeGames/totalBonusWin.png');
        this.load.image('freeGamesCount', 'assets/freeGames/freeGamesCount.png');
        this.load.image('freeGamesFrame1', 'assets/freeGames/frame/frame1.png');
        this.load.image('moneyDisplayBg', 'assets/freeGames/moneyDisplay/moneyDisplayBg.png');
        this.load.image('freeGamesBg', 'assets/freeGames/bg.jpg');
        this.load.image('freeGamesBonus', 'assets/freeGames/bonus.png');

        this.load.spritesheet('numbers', 'assets/freeGames/numbers.png', {
            frameWidth: 52,
            frameHeight: 32,
            endFrame: 10
        });

        ////////////////////////////////////////////////////////////////////
        // FreeSpins
        ////////////////////////////////////////////////////////////////////

        this.load.image('bigFrameWithoutShadow', 'assets/frame/frameWithoutShadow.png');
        this.load.image('freeSpinText', 'assets/freeSpinText.png');
        this.load.image('moreToUnlock', 'assets/moreToUnlock.png');
        this.load.image('featureComplete', 'assets/featurecomplete.png');
        this.load.image('winner', 'assets/winner.png');
        this.load.image('secondBar', 'assets/secondBar.png');
        this.load.image('winnerDisplay', 'assets/blueframe0.png');
        this.load.multiatlas('exp', 'assets/exp/exp.json', 'assets/exp');
        this.load.multiatlas('borderFire', 'assets/borderFire/borderFire.json', 'assets/borderFire');
        this.load.multiatlas('blow', 'assets/blow/blow.json', 'assets/blow');
        this.load.multiatlas('cellFire', 'assets/cellFire/cellFire.json', 'assets/cellFire');
        this.load.multiatlas('secondFrame', 'assets/frame/frame.json', 'assets/frame');
        this.load.multiatlas('bigFire', 'assets/bigFire/bigFire.json', 'assets/bigFire');
        this.load.multiatlas('glass', 'assets/glass/glass.json', 'assets/glass');
        this.load.multiatlas('sparks', 'assets/sparks/sparks.json', 'assets/sparks');

        this.load.spritesheet('locks', 'assets/locks.png', {
            frameWidth: 90,
            frameHeight: 85,
            endFrame: 17
        });

        this.load.spritesheet('spinsRemaining', 'assets/spinsRemaining.png', {
            frameWidth: 278,
            frameHeight: 44,
            endFrame: 4
        });

        ////////////////////////////////////////////////////////////////////
        // Slots
        ////////////////////////////////////////////////////////////////////

        this.load.image('frame', 'assets/frame.png');
        this.load.image('frameWithoutShadow', 'assets/frameWithoutShadow.png');
        this.load.image('cells', 'assets/bar.png');
        this.load.multiatlas('bigWin', 'assets/bigWin/bigWin.json', 'assets/bigWin');

        frameElems.forEach(name => {
            this.load.multiatlas(`${name}`,
                `assets/elements/${name}/${name}.json`,
                `assets/elements/${name}`
            )
        });
        fireBalls.forEach(name => {
            this.load.multiatlas(
                `${name}`,
                `assets/elements/fireBalls/${name}/${name}.json`,
                `assets/elements/fireBalls/${name}`
            )
        });

        ////////////////////////////////////////////////////////////////////
        // OverlayWindow
        ////////////////////////////////////////////////////////////////////

        this.load.multiatlas('brill', 'assets/brill/brill.json', 'assets/brill');
        this.load.multiatlas('youWon', 'assets/freeGames/youWon/youWon.json', 'assets/freeGames/youWon');
        this.load.multiatlas('pressToStart', 'assets/freeGames/pressToStart/pressToStart.json', 'assets/freeGames/pressToStart');

        ////////////////////////////////////////////////////////////////////
        // Denom
        ////////////////////////////////////////////////////////////////////

        this.load.image('denomButtonsDisplay', 'assets/buttons/denomButtonsDisplay.png');
        this.load.image('selectDenomText', 'assets/buttons/selectDenomText.png');
        this.load.image('balanceText', 'assets/buttons/balanceText.png');

        ['1c', '2c', '5c', '10c', '1d'].forEach(button => {
            this.load.spritesheet(`${button}`, `assets/buttons/${button}.png`, {
                frameWidth: 238,
                frameHeight: 199,
                endFrame: 2
            });
        });

        ////////////////////////////////////////////////////////////////////
        // Panel
        ////////////////////////////////////////////////////////////////////

        if (isMobile) {
            this.load.spritesheet('spinBtn', 'assets/buttons/mobile/spin.png', {
                frameWidth: 200,
                frameHeight: 220,
                endFrame: 3
            });
            this.load.spritesheet('infoBtn', 'assets/buttons/mobile/info.png', {
                frameWidth: 196,
                frameHeight: 92,
                endFrame: 2
            });
            this.load.spritesheet('decreaseBtn', 'assets/buttons/mobile/decrease.png', {
                frameWidth: 55,
                frameHeight: 92,
                endFrame: 2
            });
            this.load.spritesheet('increaseBtn', 'assets/buttons/mobile/increase.png', {
                frameWidth: 56,
                frameHeight: 92,
                endFrame: 2
            });
            this.load.spritesheet('denomButtons', 'assets/buttons/mobile/denomButtons.png', {
                frameWidth: 199,
                frameHeight: 123,
                endFrame: 5
            });

            this.load.image('panel', 'assets/buttons/mobile/mobileBottomPanel.png');
        } else {
            this.load.spritesheet('spinBtn', 'assets/buttons/spin.png', {
                frameWidth: 157,
                frameHeight: 144,
                endFrame: 3
            });
            this.load.spritesheet('infoBtn', 'assets/buttons/info.png', {
                frameWidth: 104,
                frameHeight: 104,
                endFrame: 2
            });
            this.load.spritesheet('decreaseBtn', 'assets/buttons/decrease.png', {
                frameWidth: 79,
                frameHeight: 120,
                endFrame: 2
            });
            this.load.spritesheet('increaseBtn', 'assets/buttons/increase.png', {
                frameWidth: 79,
                frameHeight: 119,
                endFrame: 2
            });
            this.load.spritesheet('denomButtons', 'assets/buttons/denomButtons.png', {
                frameWidth: 187,
                frameHeight: 144,
                endFrame: 5
            });

            this.load.image('panel', 'assets/buttons/bottomPanel.png');
        }

        this.load.spritesheet('autoPlayBtn', 'assets/buttons/auto-play.png', {
            frameWidth: 188,
            frameHeight: 144,
            endFrame: 4
        });

        this.load.spritesheet('volumeBtn', 'assets/buttons/volume.png', {
            frameWidth: 103,
            frameHeight: 104,
            endFrame: 4
        });


        ///////////////////////////////////////

        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('winText', 'assets/buttons/winText.png');
        this.load.image('goodLuckText', 'assets/buttons/goodLuckText.png');
        this.load.image('gameOverText', 'assets/buttons/gameOverText.png');
        this.load.image('goodLuck', 'assets/buttons/goodLuck.png');
        this.load.image('buttonBg', 'assets/buttons/buttonBg.png');
        this.load.image('gameRules', 'assets/buttons/gameRules.png');
        this.load.image('pressToSpin', 'assets/buttons/pressToSpin.png');

        ////////////////////////////////////////////////////////////////////
        // MainWindow
        ////////////////////////////////////////////////////////////////////

        this.load.image('roofPart1', 'assets/roof.png');
        this.load.image('roofPart2', 'assets/roof1.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('title1', 'assets/title1.png');
        this.load.image('fireBallRight', 'assets/fireBallRight.png');
        this.load.image('fireBallLeft', 'assets/fireBallLeft.png');
        this.load.image('staticOlveraStreet', 'assets/olvera/staticOlveraStreet.png');
        this.load.image('jackpot1', 'assets/jackpotFrames/1.png');
        this.load.image('jackpot2', 'assets/jackpotFrames/2.png');
        this.load.image('jackpot3', 'assets/jackpotFrames/3.png');
        this.load.image('jackpot4', 'assets/jackpotFrames/4.png');

        this.load.multiatlas('olvera', 'assets/olvera/olvera.json', 'assets/olvera');
        this.load.multiatlas('logo', 'assets/logo/logo.json', 'assets/logo');
    }

    create() {
        this.createAnims();
        this.scene.launch('Denom');
        this.scene.launch('Musics');
        this.scene.launch('Slots');
        this.scene.launch('MainWindow');
        this.scene.launch('Panel');
        this.scene.launch('Settings');
        this.scene.launch('OverlayWindow');
        this.scene.launch('Rules');
        this.scene.launch('FreeGames');

        this.input.mouse.disableContextMenu();
    }

    createAnims() {
        this.anims.create({key: 'blow', frames: this.anims.generateFrameNames('blow'), frameRate: 18});
        this.anims.create({key: 'exp', frames: this.anims.generateFrameNames('exp'), frameRate: 32});
        this.anims.create({key: 'cellFire', frames: this.anims.generateFrameNames('cellFire'), frameRate: 18});
        this.anims.create({key: 'borderFire', frames: this.anims.generateFrameNames('borderFire'), frameRate: 12});
        this.anims.create({key: 'freeGamesFrame', frames: this.anims.generateFrameNames('freeGamesFrame')});
        this.anims.create({key: 'pressToStart', frames: this.anims.generateFrameNames('pressToStart'), repeat: -1});
        this.anims.create({key: 'sparks', frames: this.anims.generateFrameNames('sparks')});
        this.anims.create({key: 'glass', frames: this.anims.generateFrameNames('glass')});
        this.anims.create({key: 'bigWin', frames: this.anims.generateFrameNames('bigWin')});
        this.anims.create({key: 'brill', frames: this.anims.generateFrameNames('brill'), repeat: 3});
        this.anims.create({key: 'secondFrame', frames: this.anims.generateFrameNames('secondFrame'), frameRate: 32});
        this.anims.create({key: 'youWon', frames: this.anims.generateFrameNames('youWon'), frameRate: 24});
        this.anims.create({
            key: 'bigFire',
            frames: this.anims.generateFrameNames('bigFire'),
            frameRate: 24,
            repeat: -1
        });
        this.anims.create({
            key: 'confetti',
            frameRate: 30,
            frames: this.anims.generateFrameNames('confetti')
        });
        this.anims.create({key: 'logo', frames: this.anims.generateFrameNames('logo'), repeat: -1, repeatDelay: 15000});
        this.anims.create({key: 'olvera', frames: this.anims.generateFrameNames('olvera'), frameRate: 30});
        this.anims.create({
            key: 'denomOlvera',
            frames: this.anims.generateFrameNames('olvera'),
            frameRate: 30,
            repeat: -1,
            repeatDelay: 10000
        });
        this.anims.create({
            key: 'freeGamesText',
            frames: this.anims.generateFrameNames('freeGamesText'),
            repeat: -1,
            delay: 8000,
            repeatDelay: 4000
        });
        this.anims.create({
            key: 'freeGamesMoneyDisplay',
            frames: this.anims.generateFrameNames('freeGamesMoneyDisplay'),
            repeat: -1,
            repeatDelay: 3000,
            delay: 5000
        });
        this.anims.create({key: 'freeGames', frames: this.anims.generateFrameNames('freeGames')});

        [...frameElems, ...fireBalls].forEach(i => {
            this.anims.create({
                key: i,
                frames: this.anims.generateFrameNames(i),
                repeat: i === 'picture' ? 0 : -1,
            });
        });
    }
}


export {Loader};
