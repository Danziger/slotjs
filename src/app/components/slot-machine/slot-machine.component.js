import { SYMBOLS_CLASSIC } from '../../constants/symbols.constants';
import { resetAnimations } from '../../utils/animation.util';
import { SMSoundService } from '../../services/slot-machine/sound/slot-machine-sound.service';
import { SMVibrationService } from '../../services/slot-machine/vibration/slot-machine-vibration.service';

import { SlotMachineReel } from './reel/slot-machine-reel.component';

import './slot-machine.style.scss';


export class SlotMachine {

    // CSS classes:
    static C_HAS_ZOOM = 'has-zoom';

    // CSS selectors:
    static S_BASE = '.sm__base';
    static S_REELS_CONTAINER = '.sm__reelsContainer';
    static S_DISPLAY = '.sm__display';

    // CSS variables:
    static V_REEL_SIZE = '--reelSize';
    static V_DISPLAY_SIZE = '--displaySize';
    static V_DISPLAY_ZOOM = '--displayZoom';

    // Misc.:
    static CENTER_N_MARGIN_UNITS = 4;
    static ZOOM_TRANSITION = 'transform ease-in-out 500ms 250ms';
    static ZOOM_TRANSITION_DURATION = 1000;
    static BLIP_RATE = 4;

    // Elements:
    root = document.querySelector(SlotMachine.S_BASE);
    reelsContainer = document.querySelector(SlotMachine.S_REELS_CONTAINER);
    display = document.querySelector(SlotMachine.S_DISPLAY);
    reels = [];

    // Config:
    blipFading;
    reelCount;
    symbols;
    alpha;
    speed;

    // State:
    zoomTransitionTimeoutID = null;
    currentReel = null;
    blipCounter = 0;
    lastUpdate = 0;

    constructor(reelCount, symbols, speed) {
        this.init(reelCount, symbols, speed);

        window.onresize = this.handleResize.bind(this);
        document.onclick = this.handleClick.bind(this);
    }

    init(reelCount = 3, symbols = SYMBOLS_CLASSIC, speed = -0.75) {
        const alpha = this.alpha = 360 / symbols.length;
        const shuffledSymbols = [...symbols];

        this.blipFading = -1 / reelCount;
        this.reelCount = reelCount;
        this.symbols = symbols;
        this.speed = speed;

        // Sets --reelSize and --displaySize:
        this.resize();

        const { reelsContainer, reels } = this;

        for (let reelIndex = 0; reelIndex < reelCount; ++reelIndex) {
            const reel = new SlotMachineReel(reelIndex, alpha, shuffledSymbols);

            reelsContainer.appendChild(reel.root);
            reels.push(reel);
        }

        // Additional reel at the end that acts as a "cover" in case we set a background color on them and we only want
        // to see a ring even in the inner-most one, instead of a filled circle:
        reelsContainer.appendChild(new SlotMachineReel(reelCount).root);
    }

    start() {
        this.currentReel = 0;
        this.zoomOut();
        this.reels.forEach(reel => reel.reset());
        resetAnimations();

        SMVibrationService.start();

        this.lastUpdate = performance.now();
        requestAnimationFrame(() => this.tick());
    }

    stop() {
        this.currentReel = null;
        this.zoomIn();

        // TODO: Check win

        SMSoundService.unlucky();
    }

    tick() {
        const { reels, speed, currentReel, lastUpdate } = this;
        const now = performance.now();
        const deltaTime = now - lastUpdate;
        const deltaAlpha = deltaTime * speed;

        if (currentReel === null) {
            return;
        }

        const blipCounter = this.blipCounter = (this.blipCounter + 1) % SlotMachine.BLIP_RATE;

        if (blipCounter === 0) {
            SMSoundService.blip(this.blipFading * currentReel);
        }

        this.lastUpdate = now;

        for (let i = reels.length - 1; i >= currentReel; --i) {
            const reel = reels[i];
            const angle = reel.angle = (360 + (reel.angle + deltaAlpha)) % 360;

            reel.style.transform = `rotate(${ angle }deg)`;
        }

        requestAnimationFrame(() => this.tick());
    }

    zoomIn() {
        this.zoom();
    }

    zoomOut() {
        this.zoom(true);
    }

    zoom(out = false) {
        clearTimeout(this.zoomTransitionTimeoutID);

        const { root } = this;

        root.style.transition = SlotMachine.ZOOM_TRANSITION;
        root.classList[out ? 'remove' : 'add'](SlotMachine.C_HAS_ZOOM);

        // We do this as transition end will bubble up and fire a lot of times, not only for this transition:
        this.zoomTransitionTimeoutID = setTimeout(() => {
            root.style.transition = '';
        }, SlotMachine.ZOOM_TRANSITION_DURATION);
    }

    resize() {
        const { root, reelCount, display } = this;
        const { style } = root;
        const { innerWidth, innerHeight } = window;
        const size = Math.min(innerWidth, innerHeight) / (2 * reelCount + SlotMachine.CENTER_N_MARGIN_UNITS) | 0;

        style.setProperty(SlotMachine.V_REEL_SIZE, `${ size }px`);
        style.setProperty(SlotMachine.V_DISPLAY_SIZE, `${ size * reelCount }px`);
        style.setProperty(SlotMachine.V_DISPLAY_ZOOM, `${ root.offsetWidth / display.offsetWidth }`);
    }

    stopReel(reelIndex) {
        const { speed } = this;
        const deltaAlpha = (performance.now() - this.lastUpdate) * speed;

        this.reels[reelIndex].stop(speed, deltaAlpha);

        SMSoundService.stop();
        SMVibrationService.stop();
    }

    handleClick() {
        const { currentReel } = this;

        if (currentReel === null) {
            this.start();
        } else {
            ++this.currentReel;

            this.stopReel(currentReel);

            if (currentReel === this.reels.length - 1) {
                this.stop();
            }
        }
    }

    handleResize() {
        requestAnimationFrame(() => this.resize());
    }

}
