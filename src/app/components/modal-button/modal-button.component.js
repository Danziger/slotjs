export class ModalButton {

    // CSS classes:
    static C_IS_OPEN = 'is-open';

    // Elements:
    root;

    // State:
    label;
    isOpen;

    // Callbacks:
    onButtonClick;

    constructor(selector, label, isOpen, onButtonClick) {
        const root = this.root = document.querySelector(selector);

        this.label = label;
        this.onButtonClick = onButtonClick;

        if (isOpen) {
            this.open();
        } else {
            this.close();
        }

        root.onclick = this.handleButtonClicked.bind(this);
    }

    open() {
        const { label } = this;

        this.root.classList.add(ModalButton.C_IS_OPEN);
        this.root.setAttribute('title', `Close ${ label }`);
        this.root.setAttribute('aria-label', `Close ${ label }`);

        this.isOpen = true;
        this.onButtonClick && this.onButtonClick(true);
    }

    close() {
        const { label } = this;

        this.root.classList.remove(ModalButton.C_IS_OPEN);
        this.root.setAttribute('title', `Open ${ label }`);
        this.root.setAttribute('aria-label', `Open ${ label }`);

        this.isOpen = false;
        this.onButtonClick && this.onButtonClick(false);
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    handleButtonClicked(e) {
        e.stopPropagation();

        document.activeElement.blur();

        this.toggle();
    }

}
