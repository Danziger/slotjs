import { IS_FIREFOX } from '../../../constants/browser.constants';
import { Sound } from '../../../../common/utils/sound/sound';

class SMSoundServiceClass {

    static EXTENSION = IS_FIREFOX ? 'ogg' : 'mp3';

    blipSound = new Sound(`./sounds/blip.${ SMSoundServiceClass.EXTENSION }`);
    coinSound = new Sound(`./sounds/coin.${ SMSoundServiceClass.EXTENSION }`);
    stopSound = new Sound(`./sounds/stop.${ SMSoundServiceClass.EXTENSION }`);
    unluckySound = new Sound(`./sounds/unlucky.${ SMSoundServiceClass.EXTENSION }`);
    winSound = new Sound(`./sounds/win.${ SMSoundServiceClass.EXTENSION }`);

    soundsStatus = 'loading';

    isEnabled = false;

    constructor() {
        this.loadSounds();
    }

    loadSounds() {
        this.soundsStatus = 'loading';
        this.isEnabled = false;

        Promise.all([
            this.blipSound.load(),
            this.coinSound.load(),
            this.stopSound.load(),
            this.unluckySound.load(),
            this.winSound.load(),
        ]).then(() => {
            this.soundsStatus = 'loaded';
            this.isEnabled = true;
        }).catch(() => {
            this.soundsStatus = 'error';
            this.isEnabled = false;
        });
    }

    enable() {
        if (this.soundsStatus === 'loaded') {
            this.isEnabled = true;
        } else if (this.soundsStatus === 'error') {
            this.loadSounds();
        }
    }

    disable() {
        if (this.soundsStatus !== 'loaded') return;

        this.isEnabled = false;

        this.blipSound.stop();
        this.coinSound.stop();
        this.stopSound.stop();
        this.unluckySound.stop();
        this.winSound.stop();
    }

    blip(...args) {
        this.isEnabled && this.blipSound.play(...args);
    }

    coin(...args) {
        this.isEnabled && this.coinSound.play(...args);
    }

    stop(...args) {
        this.isEnabled && this.stopSound.play(...args);
    }

    unlucky(...args) {
        this.isEnabled && this.unluckySound.play(...args);
    }

    win(...args) {
        this.isEnabled && this.winSound.play(...args);
    }

}


export const SMSoundService = new SMSoundServiceClass();
