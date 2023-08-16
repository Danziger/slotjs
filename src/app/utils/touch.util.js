import { IS_IOS } from '../constants/browser.constants';

let tap = false;
let callback = null;

function startTap() {
    tap = true;
}

function stopTap() {
    tap = false;
}

function invokeCallback() {
    if (tap) {
        callback();
        tap = false;
    }
}

export function setGlobalClickAndTabHandler(cb) {
    callback = cb;

    if (IS_IOS) {
        document.ontouchstart = startTap;
        document.ontouchmove = stopTap;
        document.ontouchcancel = stopTap;
        document.ontouchend = invokeCallback;
    } else {
        document.onmousedown = cb;
    }
}
