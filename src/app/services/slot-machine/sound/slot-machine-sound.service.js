import { IS_FIREFOX } from '../../../constants/browser.constants';
import { SoundBuffer } from '../../../../common/utils/sound/sound-buffer';

const extension = IS_FIREFOX ? 'ogg' : 'mp3';
const blipSound = new SoundBuffer(`./sounds/blip.${ extension }`, 32);
const coinSound = new SoundBuffer(`./sounds/coin.${ extension }`);
const stopSound = new SoundBuffer(`./sounds/stop.${ extension }`);
const unluckySound = new SoundBuffer(`./sounds/unlucky.${ extension }`);
const winSound = new SoundBuffer(`./sounds/win.${ extension }`);

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
