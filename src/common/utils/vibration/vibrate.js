const { navigator } = window;

export const vibrate = navigator.vibrate ? navigator.vibrate.bind(navigator) : (() => {});
