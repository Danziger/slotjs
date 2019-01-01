import { IS_FIREFOX } from '../../../constants/browser.constants';
import { SoundBuffer } from '../../../../common/utils/sound/sound-buffer';

const extension = IS_FIREFOX ? 'ogg' : 'mp3';
const blipSound = new SoundBuffer(`./assets/blip.${ extension }`, 16);
const coinSound = new SoundBuffer(`./assets/coin.${ extension }`);
const stopSound = new SoundBuffer(`./assets/stop.${ extension }`);
const unluckySound = new SoundBuffer(`./assets/unlucky.${ extension }`, 4);
const winSound = new SoundBuffer(`./assets/win.${ extension }`, 4);

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
