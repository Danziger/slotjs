import { capitalize } from '../../utils/format.util';

export class ToggleButton {

    // CSS classes:
    static C_IS_DISABLED = 'is-disabled';

    // Elements:
    root;
    icon;

    // State:
    key;
    value;
    onButtonClick;

    constructor(selector, key, initialValue, onButtonClick) {
        const root = this.root = document.querySelector(selector);

        this.icon = root.children[0];

        this.key = key;
        this.onButtonClick = onButtonClick;

        if (initialValue) {
            this.enable();
        } else {
            this.disable();
        }

        root.onclick = this.handleButtonClicked.bind(this);
    }

    enable() {
        const label = capitalize(this.key);

        this.root.classList.remove(ToggleButton.C_IS_DISABLED);
        this.root.setAttribute('title', `Turn ${ label } Off`);
        this.root.setAttribute('aria-label', `Turn ${ label } Off`);
        this.icon.setAttribute('aria-label', `${ label } Is On`);

        this.value = true;
        this.onButtonClick && this.onButtonClick(this.key, true);
    }

    disable() {
        const label = capitalize(this.key);

        this.root.classList.add(ToggleButton.C_IS_DISABLED);
        this.root.setAttribute('title', `Turn ${ label } On`);
        this.root.setAttribute('aria-label', `Turn ${ label } On`);
        this.icon.setAttribute('aria-label', `${ label } Is Off`);

        this.value = false;
        this.onButtonClick && this.onButtonClick(this.key, false);
    }

    toggle() {
        if (this.value) {
            this.disable();
        } else {
            this.enable();
        }
    }

    handleButtonClicked(e) {
        e.stopPropagation();

        document.activeElement.blur();

        this.toggle();
    }

}
