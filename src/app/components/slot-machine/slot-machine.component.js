import { createElement } from '../../utils/dom.util';
import { stopAt, resetAnimations } from '../../utils/animation.util';
import { shuffle } from '../../utils/array.util';
import { SYMBOLS_RANDOM } from '../../constants/symbols.constants';

import './slot-machine.style.scss';

export class SlotMachine {

    static SELECTOR_BASE = '.sm__base';
    static SELECTOR_DISPLAY = '.sm__display';
    static SELECTOR_REEL = '.sm__reel';

    // Elements:
    root = document.querySelector(SlotMachine.SELECTOR_BASE);
    display = document.querySelector(SlotMachine.SELECTOR_DISPLAY);
    reels = [];

    // Visual config:
    shadows = [4, 3, 3, 2, 1];
    symbols = [...SYMBOLS_RANDOM];
    alpha = 360 / SYMBOLS_RANDOM.length;

    // State:
    currentReel = null;
    speed = -0.75;
    lastUpdate = 0;

    constructor() {
        this.init();

        document.onclick = this.handleClick.bind(this);
    }

    init() {
        const { alpha, shadows, symbols } = this;

        this.reels = Array
            .from(document.querySelectorAll(SlotMachine.SELECTOR_REEL))
            .slice(0, -1)
            .map((reel, ireel) => {
                shuffle(symbols);

                symbols.forEach((symbol, isymbol) => {
                    const slotText = createElement('sm__cellFigure', symbol);
                    const slot = createElement('sm__cell', slotText.cloneNode(true), isymbol * alpha);

                    reel.appendChild(slot);

                    const totalShadows = shadows[ireel];
                    const beta = 1 / (totalShadows + 1);

                    for (let ishadow = 1; ishadow <= totalShadows; ++ishadow) {
                        reel.appendChild(createElement(
                            `sm__cell sm__shadow sm__shadow-${ ishadow }`,
                            slotText.cloneNode(true),
                            (isymbol + beta * ishadow) * alpha,
                        ));
                    }
                });

                return { element: reel, style: reel.style, angle: 0 };
            });
    }

    start() {
        const { reels, root } = this;

        resetAnimations();

        reels.map(reel => reel.element.classList.remove('is-stop'));
        root.style = '';

        this.currentReel = 0;
        this.lastUpdate = performance.now();

        window.navigator.vibrate([50, 50, 50, 50, 50, 50, 25, 25, 25, 25, 25, 25, 25, 25].reverse());

        requestAnimationFrame(() => this.tick());
    }

    stop() {
        this.currentReel = null;

        // TODO: 32 is a css variable!
        this.root.style.transform = `scale(${ (window.innerWidth - 32) / this.display.offsetWidth })`;

        // TODO: Check win
    }

    tick() {
        const { reels, speed, currentReel, lastUpdate } = this;
        const now = performance.now();
        const deltaTime = now - lastUpdate;
        const deltaAlpha = deltaTime * speed;

        if (currentReel === null) {
            return;
        }

        this.lastUpdate = now;

        for (let i = reels.length - 1; i >= currentReel; --i) {
            const reel = reels[i];
            const angle = reel.angle = (360 + (reel.angle + deltaAlpha)) % 360;

            reel.style.transform = `rotate(${ angle }deg)`;
        }

        requestAnimationFrame(() => this.tick());
    }

    stopReel(reelIndex) {
        const { alpha, speed } = this;
        const deltaAlpha = (performance.now() - this.lastUpdate) * speed;
        const reel = this.reels[reelIndex];
        const angle = (360 - reel.angle - deltaAlpha) % 360;
        const index = Math.ceil(angle / alpha);
        const stopAngle = index * alpha;
        const animationName = `stop-${ reelIndex }`;
        const animationDuration = stopAt(
            animationName,
            (360 - angle) % 360,
            (360 - stopAngle) % 360,
            alpha,
            speed,
        ) * 5;

        window.navigator.vibrate([200, 50, 50, 50, 50, 25, 25, 25, 25, 25, 25, 25, 25]);

        reel.style.animation = `${ animationName } ${ animationDuration }ms ease-out forwards`;
        reel.element.classList.add('is-stop');
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

}
