import { stopAtAnimation } from '../../../utils/animation.util';
import { createElement } from '../../../utils/dom.util';
import { shuffle } from '../../../utils/array.util';

export class SlotMachineReel {

    // CSS classes:
    static C_REEL = 'sm__reel';
    static C_CELL = 'sm__cell';
    static C_CELL_SHADOW = 'sm__cell--shadow';
    static C_FIGURE = 'sm__figure';
    static C_IS_STOP = 'is-stop';

    // CSS variables:
    static V_INDEX = '--index';

    // Misc.:
    static STOP_ANIMATION_DURATION_MULTIPLIER = 5;

    // TODO: Calculate dynamically...
    shadows = [4, 3, 2, 1, 0];

    // Elements:
    root;
    style;

    // Config:
    index;
    alpha;

    // State:
    angle = 0;
    stopAt = 0;

    constructor(index, alpha = 0, symbols = []) {
        this.index = index;
        this.alpha = alpha;

        const { C_REEL, C_CELL, C_CELL_SHADOW, C_FIGURE, C_IS_STOP, V_INDEX } = SlotMachineReel;
        const root = this.root = createElement([C_REEL, C_IS_STOP]);
        const style = this.style = root.style;

        style.setProperty(V_INDEX, index);

        shuffle(symbols);

        symbols.forEach((symbol, symbolIndex) => {
            const cellFigure = createElement(C_FIGURE, symbol);
            const cell = createElement(C_CELL, cellFigure, symbolIndex * alpha);

            root.appendChild(cell);

            // TODO: Calculate using size or %:
            const shadowCount = this.shadows[index] + 1;
            const beta = 1 / shadowCount;

            for (let shadowIndex = 1; shadowIndex < shadowCount; ++shadowIndex) {
                root.appendChild(createElement(
                    [C_CELL, C_CELL_SHADOW, `${ C_CELL_SHADOW }-${ shadowIndex }`],
                    cellFigure.cloneNode(true),
                    alpha * (symbolIndex + beta * shadowIndex),
                ));
            }
        });
    }

    reset() {
        const { root, style, stopAt } = this;

        root.classList.remove('is-stop');
        style.transform = `rotate(${ this.angle = ((360 - stopAt) % 360) }deg)`;
        style.animation = '';

        this.stopAt = 0;
    }

    stop(speed, deltaAlpha) {
        const { alpha } = this;
        const angle = (360 - this.angle - deltaAlpha) % 360;
        const index = Math.ceil(angle / alpha);
        const stopAt = index * alpha;
        const animationName = `stop-${ this.index }`;
        const animationDuration = stopAtAnimation(
            animationName,
            (360 - angle) % 360,
            (360 - stopAt) % 360,
            alpha,
            speed,
        ) * SlotMachineReel.STOP_ANIMATION_DURATION_MULTIPLIER;

        this.style.animation = `${ animationName } ${ animationDuration }ms ease-out forwards`;
        this.root.classList.add(SlotMachineReel.C_IS_STOP);
        this.stopAt = stopAt;
    }

}
