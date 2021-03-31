export const IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform || '');

export const IS_FIREFOX = navigator.userAgent.toLowerCase().includes('firefox');

export const HAS_TOUCH = navigator.maxTouchPoints > 0
    || 'ontouchstart' in window
    || (window.DocumentTouch && document instanceof window.DocumentTouch);
