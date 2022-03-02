import { IS_FIREFOX } from '../../../constants/browser.constants';
import { SoundBuffer } from '../../../../common/utils/sound/sound-buffer';

const extension = IS_FIREFOX ? 'ogg' : 'mp3';
const blipSound = new SoundBuffer(`./sounds/blip.${ extension }`, 32);
const coinSound = new SoundBuffer(`./sounds/coin.${ extension }`);
const stopSound = new SoundBuffer(`./sounds/stop.${ extension }`);
const unluckySound = new SoundBuffer(`./sounds/unlucky.${ extension }`);
const winSound = new SoundBuffer(`./sounds/win.${ extension }`);

let isEnabled = true;

export const SMSoundService = {

    blip(...args) {
        isEnabled && blipSound.play(...args);
    },

    coin(...args) {
        isEnabled && coinSound.play(...args);
    },

    stop(...args) {
        isEnabled && stopSound.play(...args);
    },

    unlucky(...args) {
        isEnabled && unluckySound.play(...args);
    },

    win(...args) {
        isEnabled && winSound.play(...args);
    },

    enable() {
        isEnabled = true;
    },

    disable() {
        isEnabled = false;

        blipSound.stop();
        coinSound.stop();
        stopSound.stop();
        unluckySound.stop();
        winSound.stop();
    },

};
