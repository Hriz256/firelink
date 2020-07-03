import {game, offsetX, height, isMobile, gameWidth} from '../Config';

class FreeSpins extends Phaser.Scene {

    constructor() {
        super('FreeSpins');

        this.rows = {};

        this.allow = true;
        this.isPressSpinToStartClicked = false;
        this.spinDate = 0;
        this.array = [];
        this.isEndOfTheGame = false;
        this.freeSpinStart = false;

        this.tileWidth = 250;
        this.tileHeight = 136;

        for (let i = 0; i < 18; i++) {
            this.array.push(60 + (250 * i))
        }

        this.fireballNames = {
            '50x': 60,
            '75x': 810,
            '100x': 1060,
            '125x': 2060,
            '250x': 2560,
            '625x': 3810,
            'mini': 4310
        };

        this.spinsRemaining = 4;
        this.destroyedGlasses = 0;
    }

    create() {
        this.freeSpinStart = true;
        game.scene.keys['Panel'].updateButtonsFrames();

        this.cameras.main.setViewport(0, isMobile ? -15 : 0, gameWidth, height);
        this.time.delayedCall(game.scene.keys['Musics'].sounds['alarm']().duration * 1000 - 150, this.createBigFireball, [], this);

        // нужна для наложения поверх основной рамки, для перекрытия элементов
        this.bigFrame = this.add.image(offsetX, 857, 'bigFrameWithoutShadow')
            .setScale(0.54)
            .setOrigin(0.5, 1)
            .setDepth(350)
            .setAlpha(0);
        this.secondFrame = this.add.sprite(offsetX, 857, 'secondFrame', 0)
            .setScale(0.54)
            .setOrigin(0.5, 1)
            .setDepth(100)
            .setAlpha(0);

        this.freeSpinText = this.add.image(offsetX, isMobile ? height - 138 : height - 134, 'freeSpinText').setScale(0.5).setAlpha(0);
        this.featureComplete = this.add.image(offsetX, 175, 'featureComplete').setDepth(600).setAlpha(0);
    }

    update() {
        if (this.isPressSpinToStartClicked) {
            this.getUnlockCells().forEach(i => {
                if (i.isStart) i.cell.tilePositionY -= 50;
            });

            !this.isEndOfTheGame && this.allowStart()
        }
    }

    hideElems(alpha) {
        game.scene.keys['MainWindow'].changeTitlesVisibility(alpha);
        game.scene.keys['Panel'].changeTextVisibility(alpha);
        game.scene.keys['Slots'].destroyCells();
        game.scene.keys['Slots'].hideFrame(0);
        this.secondFrame.setAlpha(1);
    }

    createMask(x, y) {
        const shape = this.make.graphics();

        shape.beginPath();
        shape.fillRect(x, y, 250, 70);

        return shape.createGeometryMask();
    }

    // создание огромного фаерболла, с этой анимации начинаются фриспины
    createBigFireball() {
        const bigFire = this.add.sprite(offsetX, -830, 'bigFire').setScale(1.5).setOrigin(0.5, 0).setDepth(500).play('bigFire');

        // создаём разовые ивенты, т.к. обычная функция повторилась бы в апдейте несколько раз
        this.events.once('runFrameAnim', () => this.runFrameAnim());
        this.events.once('hideElems', () => this.hideElems(0));

        this.tweens.add({
            targets: bigFire,
            y: height + 400,
            ease: 'linear',
            duration: game.scene.keys['Musics'].sounds['bigFire']().duration * 1000 + 1500,
            onUpdateScope: this,
            onCompleteScope: this,

            onUpdate() {
                bigFire.y > 30 && game.scene.keys['MainWindow'].logo.setAlpha(0);
                bigFire.y > 150 && this.events.emit('hideElems');
                bigFire.y > 500 && this.events.emit('runFrameAnim');
            },
            onComplete() {
                bigFire.destroy();
                this.freeSpinText.setAlpha(1);
            }
        });
    }

    // анимация рамки
    runFrameAnim() {
        game.scene.keys['Musics'].sounds['createFrame']();
        this.secondFrame.anims.play('secondFrame');

        this.secondFrame.once('animationcomplete', () => {
            this.bigFrame.setAlpha(1);
            this.createCells();
        });
    }

    createCells() {
        this.bgSound = game.scene.keys['Musics'].sounds['freeSpinsBg']();

        this.spinsRemainingText = this.add.image(offsetX, height - 154, 'spinsRemaining').setDepth(600).setFrame(0).setScale(0.9);
        this.sparks();

        for (let i = 0; i < 8; i++) {
            this.rows[`${i}`] = {};

            for (let j = 0; j < 5; j++) {
                this.rows[`${i}`][`${j}`] = {};
                const y = this.array[Phaser.Math.Between(0, 17)];

                const cell = this.add.tileSprite(offsetX - 220 + (110 * j), 185 + (74.2 * i), this.tileWidth, this.tileHeight, 'secondBar')
                    .setOrigin(0.5, 0)
                    .setScale(0.53)
                    .setDepth(this.isFireballOffset(y) ? 200 : 20);

                cell.tilePositionY = y;

                this.rows[`${i}`][`${j}`].cell = cell;
                this.rows[`${i}`][`${j}`].isStart = false;
                this.rows[`${i}`][`${j}`].isStop = false;
            }
        }

        this.createUnlock();
    }

    // создания оверлеев поверх первых 4 строк
    createUnlock() {
        let numberLock = 4;
        let currentNumber = 4;

        const callback = (currentNumber) => {
            game.scene.keys['Musics'].sounds['block']();
            const bg = this.add.image(0, 0, 'moreToUnlock').setOrigin(0.5).setScale(0.54);
            const lock = this.add.image(-90, -2, 'locks').setOrigin(1, 0.5).setScale(0.47).setFrame(numberLock);

            lock.currentFrame = numberLock;

            this.rows[`${currentNumber - 1}`].unlock = this.add.container(offsetX, 443 - (74 * (4 - currentNumber)), [bg, lock]).setDepth(300);
            numberLock += 4;

            // как только создали все 4 оверлея - показываем надпись "press to spin"
            currentNumber === 1 && this.time.delayedCall(300, this.createPressToSpinPicture, [], this);
        };

        this.time.addEvent({
            delay: 300,
            callback() {
                callback(currentNumber--);
            },
            repeat: 3,
            startAt: 0
        });
    }

    createPressToSpinPicture() {
        game.scene.keys['Panel'].pressToSpin.setVisible(true).setAlpha(0);

        const anim = this.tweens.add({
            targets: game.scene.keys['Panel'].pressToSpin,
            alpha: 1,
            ease: 'linear',
            duration: 350,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {
            anim.stop();
            game.scene.keys['Panel'].pressToSpin.setVisible(false);
            this.isPressSpinToStartClicked = true;
        })
    }

    isFireballOffset(y) {
        const fireball = Object.entries(this.fireballNames).find(item => item[1] === y);

        return fireball && fireball[0]
    }

    tilePos(elem, bool) {
        game.scene.keys['Musics'].sounds['lineStop']();

        const y = this.array[Phaser.Math.Between(0, 17)];
        elem.cell.tilePositionY = y;

        const fireball = this.isFireballOffset(y);

        if (fireball && !bool) {
            game.scene.keys['Musics'].sounds['fireDrop']();
            elem.isStop = true;
            this.createExp(elem.cell, fireball);
            this.setLockFrame();
        } else {
            elem.cell.setDepth(20);
        }
    }

    setSpinsRemainingFrame(frame = false) {
        const quantityFrames = 4;
        const newFrame = !frame ? quantityFrames - --this.spinsRemaining : 0;

        if (frame) {
            this.sparks();
            this.spinsRemaining = 4;
        }

        if (newFrame > 3) {
            this.finishTheGame();

            return;
        }

        this.spinsRemainingText.setFrame(newFrame);
    }

    finishTheGame() {
        const featureCompleteSound = game.scene.keys['Musics'].sounds['featureComplete']();

        this.bgSound.stop();
        this.isEndOfTheGame = true;

        this.tweens.add({
            targets: this.featureComplete,
            alpha: 1,
            ease: 'linear',
            duration: featureCompleteSound.duration * 1000 / 10,
            yoyo: true,
            repeat: 6,
            onCompleteScope: this,
            onComplete() {
                this.featureComplete.destroy();
                this.showWinnerElements();
            }
        });
    }

    setLockFrame() {
        const array = Object.values(this.rows).filter(row => row.unlock);

        if (array.length) {
            array.forEach(i => {
                const frame = --i.unlock.list[1].currentFrame;
                frame > 0 ? i.unlock.list[1].setFrame(frame) : this.destroyUnlockImages(i)
            });
        }
    }

    destroyUnlockImages(row) {
        this.destroyGlass(row.unlock.y);
        row.unlock.destroy();
        delete row.unlock;

        if (++this.destroyedGlasses === 4) this.isEndOfTheGame = true;
    }

    allowStart() {
        this.isEvery() && this.startSpin()
    }

    startSpin() {
        if (this.allow && Date.now() - this.spinDate > 350) {
            game.scene.keys['Musics'].sounds['fireLaser']();
            this.allow = false;
            this.changeStart(true, 0);
            this.events.once('increaseSpinClick', () => game.scene.keys['MainWindow'].increaseCountSpinClick());
            this.setSpinsRemainingFrame();

            this.time.delayedCall(2000, this.endSpin, [], this);
        }
    }

    createCellFire(x, y) {
        const cellFire = this.add.sprite(x, y, 'cellFire').setScale(0.36).setOrigin(0.5, 0).play('cellFire');
        cellFire.once('animationcomplete', () => cellFire.destroy());
    }

    createBlow(x, y) {
        const blow = this.add.sprite(x, y, 'blow').setScale(0.45).setOrigin(0.5, 0.5).setDepth(500).play('blow');
        blow.once('animationcomplete', () => blow.destroy());
    }

    createBorderFire() {
        const borderFire = this.add.sprite(offsetX - 2, 445, 'borderFire').setScale(0.46).setDepth(400).play('borderFire');
        borderFire.once('animationcomplete', () => borderFire.destroy());
    }

    createExp(cell, fireballName) {
        const {x, y, height, scaleY} = cell;
        const fireball = this.add.sprite(x, y + (height * scaleY) / 2 - 7, fireballName)
            .setScale(0.53)
            .setDepth(250)
            .play(fireballName);

        fireball.setMask(this.createMask(x - this.tileWidth / 2, y));

        const exp = this.add.sprite(x, y + (height * scaleY) / 2, 'exp').setScale(0.42).setDepth(250).play('exp');
        exp.once('animationcomplete', () => exp.destroy());

        cell.destroy(); // удаляем тайлспрайт из-за ненадобности
    }

    destroyGlass(offsetY) {
        const glass = this.add.sprite(offsetX, offsetY, 'glass')
            .setScale(0.65, 0.55)
            .setDepth(600)
            .play('glass');

        glass.once('animationcomplete', () => {
            this.time.delayedCall(
                500,
                () => {
                    glass.destroy();
                    this.allow = true
                },
                [],
                this
            )
        });
    }

    sparks() {
        game.scene.keys['Musics'].sounds['spinsRemaining']();

        const sparks = this.add.sprite(offsetX, height - 155, 'sparks').setScale(0.57, 0.57).setDepth(600).play('sparks');
        sparks.once('animationcomplete', () => sparks.destroy());
    }

    flyingBalls(item, resolve) {
        const x = [offsetX - 120, offsetX, offsetX + 120][Phaser.Math.Between(0, 2)]; // фаерболы могут лететь только в 3 точки
        const y = 150;
        const ball = this.add.sprite(item.cell.x, item.cell.y + (item.cell.height * item.cell.scaleY) / 2, '50x')
            .setScale(0.53)
            .setDepth(500)
            .setAlpha(0);

        const tween = this.tweens.add({
            targets: ball,
            x: x,
            y: y,
            duration: 150,
            delay: 1300,
            onStartScope: this,
            onCompleteScope: this,
            onStart() {
                game.scene.keys['Musics'].sounds['fireBallPush']();
                ball.setAlpha(1);
                this.createCellFire(item.cell.x, item.cell.y);
                this.createBlow(x, y);
                this.createBorderFire();
            },
            onComplete() {
                ball.destroy();
                tween.stop();
                resolve()
            }
        });
    }

    showWinnerElements() {
        game.scene.keys['MainWindow'].hideJackPotsImages(false);

        const winner = this.add.image(0, isMobile ? 0 : -10, 'winner').setScale(1.2);
        const winnerDisplay = this.add.image(0, 75, 'winnerDisplay').setScale(0.95);
        this.add.container(offsetX, 45, [winner, winnerDisplay]);

        const callback = () => {
            this.freeSpinStart = false;
            game.scene.keys['OverlayWindow'].secondAnimStart = false;
            game.scene.keys['OverlayWindow'].fade(this, false);
        };

        (async () => {
            for (const item of this.getFireballs()) {
                await new Promise(resolve => this.flyingBalls(item, resolve));
            }

            this.time.delayedCall(game.scene.keys['Musics'].sounds['freeSpinsEnd']().duration * 1000 + 3000, callback, [], this)
        })();

        this.scaleWithYoyo(winner);
    }

    scaleWithYoyo(target) {
        this.tweens.add({
            targets: target,
            scale: 1.1,
            ease: 'linear',
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    };

    isEvery() {
        return this.getUnlockCells().every(i => !i.isStart)
    }

    getCells() {
        return Object.values(this.rows)
            .reduce((acc, item) => {
                return [
                    ...acc,
                    ...Object.values(item).filter(i => typeof i === 'object' && i.type !== 'Container')
                ]
            }, [])
    }

    getFireballs() {
        return this.getCells().filter(i => i.isStop);
    }

    getUnlockCells() {
        return this.getCells().filter(i => !i.isStop);
    }

    endSpin() {
        this.changeStart(false, 200);
    }

    toggleCellMovement(cell, value) {
        cell.isStart = value;
        this.tilePos(cell, value);
    }

    changeStart(value, time) {
        const quantityFireballs = this.getFireballs().length;
        const unlockCells = this.getUnlockCells();

        let index = 0;

        const callback = () => {
            this.toggleCellMovement(unlockCells[index], value);

            if (this.isEvery()) {
                this.allow = true;
                this.spinDate = Date.now();

                this.events.emit('increaseSpinClick');

                this.getFireballs().length - quantityFireballs > 0 && this.setSpinsRemainingFrame(true);
                this.isEndOfTheGame && this.finishTheGame();
            }

            index++;
        };

        value ?
            unlockCells.forEach((cell) => this.toggleCellMovement(cell, value)) :
            this.time.addEvent({
                delay: time,
                callback() {
                    callback();
                },
                repeat: unlockCells.length - 1,
                startAt: 0
            });
    }
}

export {FreeSpins};
