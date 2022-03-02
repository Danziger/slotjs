import { vibrate } from '../../../../common/utils/vibration/vibrate';
import { VIBRATION_START, VIBRATION_STOP } from '../../../constants/vibration.constants';

let isEnabled = true;

export const SMVibrationService = {

    start() {
        isEnabled && vibrate(VIBRATION_START);
    },

    stop() {
        isEnabled && vibrate(VIBRATION_STOP);
    },

    enable() {
        isEnabled = true;
    },

    disable() {
        isEnabled = false;

        vibrate(0);
    },

};
