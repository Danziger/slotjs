import { vibrate } from '../../../../common/utils/vibration/vibrate';
import { VIBRATION_START, VIBRATION_STOP } from '../../../constants/vibration.constants';

export const SMVibrationService = {

    start() {
        vibrate(VIBRATION_START);
    },

    stop() {
        vibrate(VIBRATION_STOP);
    },

};
