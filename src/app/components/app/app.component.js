import { SYMBOLS_RANDOM } from '../../constants/symbols.constants';
import { IS_DESKTOP } from '../../constants/browser.constants';
import { SlotMachine } from '../slot-machine/slot-machine.component';
import { ToggleButton } from '../toggle-button/toggle-button.component';
import { Modal } from '../modal/modal.component';
import { PayTable } from '../pay-table/pay-table.component';
import { SMSoundService } from '../../services/slot-machine/sound/slot-machine-sound.service';
import { SMVibrationService } from '../../services/slot-machine/vibration/slot-machine-vibration.service';

import './app.style.scss';
import '../header/header.styles.scss';
import '../footer/footer.styles.scss';
import '../modal/modal.styles.scss';
import '../pay-table/pay-table.styles.scss';
import '../instructions/instructions.styles.scss';

const SERVICES = {
    sound: SMSoundService,
    vibration: SMVibrationService,
};

const handleOptionChange = (key, value) => {
    const service = SERVICES[key];

    if (service) service[value ? 'enable' : 'disable']();

    localStorage.setItem(key, value);
};

export class App {

    // CSS classes:
    static C_FOCUS_ACTIVE = 'focus-active';

    // CSS selectors:
    static S_COINS = '#coins';
    static S_JACKPOT = '#jackpot';
    static S_SPINS = '#spins';
    static S_MAIN = '#main';
    static S_TOGGLE_SOUND = '#toggleSound';
    static S_TOGGLE_VIBRATION = '#toggleVibration';
    static S_VIBRATION_INSTRUCTIONS = '#vibrationInstructions';
    static S_INSTRUCTIONS_MODAL = '#instructionsModal';
    static S_INSTRUCTIONS_MODAL_BUTTON = '#toggleInstructions';
    static S_PAY_TABLE_MODAL = '#payTableModal';
    static S_PAY_TABLE_MODAL_BUTTON = '#togglePayTable';
    static S_PLAY = '#playButton';

    // Misc.:
    static ONE_DAY = 1000 * 60 * 60 * 24;

    // Elements:
    coinsElement = document.querySelector(App.S_COINS);
    jackpotElement = document.querySelector(App.S_JACKPOT);
    spinsElement = document.querySelector(App.S_SPINS);
    mainElement = document.querySelector(App.S_MAIN);

    // Components:
    slotMachine;
    payTable;
    instructionsModal;

    // State:
    // TODO: Create constants in a config file for all these numbers...
    coins = parseInt(localStorage.coins, 10) || 100;
    jackpot = parseInt(localStorage.jackpot, 10) || 1000;
    spins = parseInt(localStorage.spins, 10) || 0;
    lastSpin = localStorage.lastSpin || 0;
    isSoundDisabled = localStorage.sound === 'false';
    isVibrationDisabled = localStorage.vibration === 'false';
    isFirstTime = localStorage.firstTime !== 'false';

    constructor() {
        const now = Date.now();

        // Update jackpot randomly:
        if (now - this.lastSpin >= App.ONE_DAY) {
            localStorage.jackpot = this.jackpot = Math.max(500, this.jackpot - 500 + (Math.random() * 1000)) | 0;
            localStorage.lastSpin = now;
        }

        // Bind event listeners:
        this.handleModalToggle = this.handleModalToggle.bind(this);
        this.handleUseCoin = this.handleUseCoin.bind(this);
        this.handleGetPrice = this.handleGetPrice.bind(this);

        let focusActive = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !focusActive) {
                focusActive = true;
                document.body.classList.add(App.C_FOCUS_ACTIVE);
            } else if (e.key === 'Escape' && focusActive) {
                focusActive = false;
                document.body.classList.remove(App.C_FOCUS_ACTIVE);
            }
        });

        document.addEventListener('mousedown', () => {
            focusActive = false;
            document.body.classList.remove(App.C_FOCUS_ACTIVE);
        });

        // Init/render conditional parts of the UI such as vibration and first-time only features:
        this.initUI();

        /*
        // TODO: Move this to CheatMode component.

        const originalSpeed = slotMachine.speed;

        let confirmation;
        let yes;
        let no;

        const wait = () => {
            // eslint-disable-next-line no-console
            console.log('Ok... 👌');

            setTimeout(() => {
                // eslint-disable-next-line no-console
                console.log(confirmation);
            }, 5000 + Math.random() * 5000);
        };

        const cheat = () => {
            slotMachine.speed = originalSpeed / 100;
            confirmation = 'Ok, really... Last chance. Do yo want to go back to normal mode? 😠';
            yes = normal; // eslint-disable-line no-use-before-define
            no = wait;

            // eslint-disable-next-line no-console
            console.log('Ok, but remember time will go on as normal for you... ⏳');
            // eslint-disable-next-line max-len, no-console
            console.log('Do you want to go back before it\'s too late?
            You don\'t want to happen to you what happened to Captain America 🛡️, do you?');
        };

        const normal = () => {
            slotMachine.speed = originalSpeed;
            confirmation = 'I\'m sure you are gonna like it...? Wanna play in God mode? 😏 💰';
            yes = cheat;
            no = wait;

            // eslint-disable-next-line no-console
            console.log('Playing in normal mode.');
            // eslint-disable-next-line no-console
            console.log('Wanna switch to God mode? 😏');
        };

        normal();

        const yesGetter = () => { yes(); };
        const noGetter = () => { no(); };

        Object.defineProperties(window, {
            yes: { get: yesGetter },
            no: { get: noGetter },
            Yes: { get: yesGetter },
            No: { get: noGetter },
        });

        */


    }

    handleUseCoin() {
        localStorage.coins = this.coins = Math.max(this.coins - 1, 0) || 100;
        localStorage.jackpot = ++this.jackpot;
        localStorage.spins = ++this.spins;
        localStorage.lastSpin = this.lastSpin = Date.now();

        this.refreshGameInfo();
    }

    handleGetPrice(jackpotPercentage) {
        const price = Math.min(Math.max(Math.ceil(jackpotPercentage * this.jackpot), 10), this.jackpot);

        localStorage.jackpot = this.jackpot = Math.max(this.jackpot - price, 0) || 1000;
        localStorage.coins = this.coins += price;

        this.refreshGameInfo();
    }

    refreshGameInfo() {
        const maxValue = Math.max(this.coins, this.jackpot, this.spins);
        const padding = Math.max(Math.ceil(maxValue.toString().length / 2) * 2, 5);

        this.coinsElement.innerText = `${ this.coins }`.padStart(padding, '0');
        this.jackpotElement.innerText = `${ this.jackpot }`.padStart(padding, '0');
        this.spinsElement.innerText = `${ this.spins }`.padStart(padding, '0');
    }

    initUI() {
        const { isFirstTime } = this;

        // Init/render the game info at the top:
        this.refreshGameInfo();

        if (IS_DESKTOP) {
            // TODO: Move to toggle button?
            document.querySelector(App.S_TOGGLE_VIBRATION).parentElement.setAttribute('hidden', true);
            // TODO: Move to instructions modal?
            document.querySelector(App.S_VIBRATION_INSTRUCTIONS).setAttribute('hidden', true);
        }

        this.initToggleButtons();

        const playButtonElement = document.querySelector(App.S_PLAY);

        if (isFirstTime) {

            playButtonElement.onclick = () => {
                this.isFirstTime = localStorage.firstTime = false;

                playButtonElement.setAttribute('hidden', true);

                this.instructionsModal.close();

                document.activeElement.blur();

                this.slotMachine.start();
            };
        } else {
            playButtonElement.setAttribute('hidden', true);
        }

        // TODO: Pass params as options, except for root selector or some of the basic ones...:

        // Init/render instructions modal, which might be open straight away:
        this.instructionsModal = new Modal(
            App.S_INSTRUCTIONS_MODAL,
            App.S_INSTRUCTIONS_MODAL_BUTTON,
            'instructions',
            isFirstTime,
            isFirstTime,
            this.handleModalToggle,
        );

        // Init/render slot machine symbols:
        this.slotMachine = new SlotMachine(
            this.mainElement,
            this.handleUseCoin,
            this.handleGetPrice,
            5,
            SYMBOLS_RANDOM,
            isFirstTime,
        );

        // Init/render pay table and pay table modal, which is always closed in the beginning:
        this.payTable = new PayTable(SYMBOLS_RANDOM);

        // TODO: Should be disabled in the begining (or hide button):
        // TODO: Hide modals with hidden rather than is-open...
        // eslint-disable-next-line no-new
        new Modal(
            App.S_PAY_TABLE_MODAL,
            App.S_PAY_TABLE_MODAL_BUTTON,
            'pay-table',
            false,
            false,
            this.handleModalToggle,
        );
    }

    initToggleButtons() {
        // eslint-disable-next-line no-new
        new ToggleButton(App.S_TOGGLE_SOUND, 'sound', !this.isSoundDisabled, handleOptionChange);

        if (!IS_DESKTOP) {
            // eslint-disable-next-line no-new
            new ToggleButton(App.S_TOGGLE_VIBRATION, 'vibration', !this.isVibrationDisabled, handleOptionChange);
        }
    }

    handleModalToggle(isOpen, key) {
        if (!this.slotMachine || key.includes('-init')) return;

        if (isOpen) {
            this.slotMachine.pause();
        } else {
            this.slotMachine.resume();
        }
    }

}
