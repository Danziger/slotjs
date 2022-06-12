import { stopAtAnimation } from '../../../utils/animation.util';
import { createElement } from '../../../utils/dom.util';
import { shuffle } from '../../../utils/array.util';
import { IS_FIREFOX } from '../../../constants/browser.constants';

export class SlotMachineReel {

    // CSS classes:
    static C_REEL = 'sm__reel';
    static C_CELL = 'sm__cell';
    static C_CELL_SHADOW = 'sm__cell--has-shadow';
    static C_CELL_BLUR = 'sm__cell--has-blur';
    static C_FIGURE = 'sm__figure';
    static C_IS_STOP = 'is-stop';

    // CSS variables:
    static V_INDEX = '--index';

    // Misc.:
    static STOP_ANIMATION_DURATION_MULTIPLIER = 5;

    // Elements:
    root;
    style;

    // Config:
    index;
    alpha;
    shadowCount;

    // State:
    angle = 0;
    stopAt = 0;

    constructor(index, alpha, symbols, diameter) {
        this.index = index;
        this.alpha = alpha;

        const { C_REEL, C_CELL, C_CELL_SHADOW, C_CELL_BLUR, C_FIGURE, C_IS_STOP, V_INDEX } = SlotMachineReel;
        const root = this.root = createElement([C_REEL, C_IS_STOP]);
        const style = this.style = root.style;

        style.setProperty(V_INDEX, index);

        if (!symbols) {
            return;
        }

        let cellShadowClasses;
        let shadowOpacityWeight;

        if (IS_FIREFOX) {
            cellShadowClasses = [C_CELL, C_CELL_SHADOW];
            shadowOpacityWeight = 0.5;
        } else {
            cellShadowClasses = [C_CELL, C_CELL_SHADOW, C_CELL_BLUR];
            shadowOpacityWeight = 1;
        }

        const shadowCount = this.shadowCount = Math.max(2, Math.round((diameter - 0.5 - (2 * index)) * Math.PI / symbols.length));
        const beta = 1 / shadowCount;

        shuffle(symbols);

        symbols.forEach((symbol, symbolIndex) => {
            const cellFigure = createElement(C_FIGURE, symbol);
            const cell = createElement(C_CELL, cellFigure, symbolIndex * alpha);

            root.appendChild(cell);

            for (let shadowIndex = 1; shadowIndex < shadowCount; ++shadowIndex) {
                root.appendChild(createElement(
                    cellShadowClasses,
                    cellFigure.cloneNode(true),
                    alpha * (symbolIndex + (beta * shadowIndex)),
                    `opacity: ${ shadowOpacityWeight * (1 - (beta * shadowIndex)) }; `,
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
        const { alpha, root } = this;
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

        this.stopAt = stopAt;
        this.style.animation = `${ animationName } ${ animationDuration }ms ease-out forwards`;
        root.classList.add(SlotMachineReel.C_IS_STOP);

        return (root.children[index * this.shadowCount] || root.children[0]).innerText;
    }

}
