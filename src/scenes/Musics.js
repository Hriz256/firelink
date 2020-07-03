class Musics extends Phaser.Scene {

    constructor() {
        super('Musics');

        this.soundNames = {
            freeSpins: [
                'fireworks.mp3', 'fireCash.mp3', 'fireLaser.mp3', 'fireDrop.mp3', 'featureComplete.mp3', 'freeSpinsEnd.mp3',
                'fireBallPush.mp3', 'freeSpinsBg.mp3', 'createFrame.mp3', 'block.mp3', 'spinsRemaining.wav'
            ],

            slots: [
                'lineStop.mp3', 'alarm.wav', 'bigFire.mp3', 'fireShow.mp3'
            ],

            systems: [
                'openSettings.mp3', 'closeSettings.mp3', 'click.mp3'
            ],

            freeGames: [
                'freeGamesBg.mp3', 'wind.wav', 'wind2.wav', 'bell.wav', 'freeGamesEnd.mp3', 'pic1.mp3', 'pic2.mp3', 'pic3.mp3'
            ]
        };

        this.sounds = {};
    }

    preload() {
        Object.entries(this.soundNames).forEach(array => {
            array[1].forEach(name => {
                this.load.audio(`${name}`.slice(0, -4), `sounds/${array[0]}/${name}`);
            })
        });
    }

    create() {
        const soundNamesArray = Object.values(this.soundNames).reduce((acc, array) => [...acc, ...array], []);

        soundNamesArray.forEach(soundName => {
            soundName = soundName.slice(0, -4);

            this.sounds[soundName] = () => {
                const sound = this.sound.add(`${soundName}`);

                soundName.toLowerCase().includes('bg') && sound.setLoop(true);
                sound.play();

                return sound;
            }
        });
    }

    setVolume(frame) {
        let value;

        if (frame === 0) {
            value = 0
        } else if (frame === 1) {
            value = 1;
        } else if (frame === 2) {
            value = 0.66;
        } else {
            value = 0.33;
        }

        this.scene.scene.sound.setVolume(value);
    }
}

export {Musics};
