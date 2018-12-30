import { SoundBuffer } from '../../../../common/utils/sound/sound-buffer';

const blipSound = new SoundBuffer('./assets/blip.mp3', 16);
const coinSound = new SoundBuffer('./assets/coin.mp3');
const stopSound = new SoundBuffer('./assets/stop.mp3');
const unluckySound = new SoundBuffer('./assets/unlucky.mp3', 4);
const winSound = new SoundBuffer('./assets/win.mp3', 4);

export const SMSoundService = {

    blip(...args) {
        blipSound.play(...args);
    },

    coin(...args) {
        coinSound.play(...args);
    },

    stop(...args) {
        stopSound.play(...args);
    },

    unlucky(...args) {
        unluckySound.play(...args);
    },

    win(...args) {
        winSound.play(...args);
    },

};
