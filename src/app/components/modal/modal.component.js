import { capitalize } from '../../utils/format.util';
import { ModalButton } from '../modal-button/modal-button.component';

export class Modal {

    // Shared across instances:
    static OPEN_MODAL = null;

    // CSS selectors:
    static S_CLOSE_BUTTON = '.modal__button';

    // CSS classes:
    static C_IS_OPEN = 'is-open';

    // Elements:
    root;
    closeButton;
    modalButton;

    // State:
    key;
    isOpen;
    isFixed;

    // Callbacks:
    onModalToggled;


    constructor(selectorRoot, selectorButton, key, isOpen, isFixed, onModalToggled) {
        this.root = document.querySelector(selectorRoot);
        this.closeButton = this.root.querySelector(Modal.S_CLOSE_BUTTON);

        this.modalButton = new ModalButton(
            selectorButton,
            capitalize(key),
            isOpen,
            this.handleButtonClicked.bind(this),
        );

        this.key = key;

        this.onModalToggled = onModalToggled;

        if (isOpen) {
            this.open('init', isFixed);
        } else {
            this.close('init');
        }

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.closeButton.onclick = (e) => {
            e.stopPropagation();

            document.activeElement.blur();

            this.close('close');
        };
    }

    addEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('click', this.handleClickOutside);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleKeyDown({ key }) {
        if (!this.isFixed && (key === 'Esc' || key === 'Escape')) this.close('esc');
    }

    handleButtonClicked(isOpen) {
        if (this.isFixed || this.isOpen === undefined || this.isOpen === isOpen) return;

        this.toggle('toggle');
    }

    handleClickOutside({ target }) {
        if (this.isFixed || target === this.root || this.root.contains(target)) return;

        this.close('outside');

    }

    open(key, isFixed) {
        if (Modal.OPEN_MODAL) Modal.OPEN_MODAL.close();

        Modal.OPEN_MODAL = this;

        if (isFixed) this.setFixed();

        this.root.classList.add(Modal.C_IS_OPEN);

        this.isOpen = true;
        this.isFixed = isFixed;
        this.onModalToggled && this.onModalToggled(true, `${ this.key }-${ key }`);

        this.modalButton.open();

        this.addEventListeners();
    }

    close(key) {
        Modal.OPEN_MODAL = null;

        // if (key !== 'init') this.removeEventListeners();
        this.removeEventListeners();

        this.root.classList.remove(Modal.C_IS_OPEN);

        if (this.isFixed) this.setDismissible();

        this.isOpen = false;
        this.isFixed = false;
        this.onModalToggled && this.onModalToggled(false, `${ this.key }-${ key }`);

        this.modalButton.close();
    }

    toggle(key) {
        if (this.isOpen) {
            this.close(key);
        } else {
            this.open(key);
        }
    }

    setFixed() {
        this.closeButton.setAttribute('hidden', true);
    }

    setDismissible() {
        this.closeButton.removeAttribute('hidden');
    }

}
