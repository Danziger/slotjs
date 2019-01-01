import { SYMBOLS_RANDOM } from '../../constants/symbols.constants';
import { SlotMachine } from '../slot-machine/slot-machine.component';

import './app.style.scss';

export class App {

    // CSS selectors:
    static S_COINS = '#coins';
    static S_JACKPOT = '#jackpot';
    static S_SPINS = '#spins';
    static S_MAIN = '#main';

    // Misc.:
    static ONE_DAY = 1000 * 60 * 60 * 24;

    // Elements:
    coinsElement = document.querySelector(App.S_COINS);
    jackpotElement = document.querySelector(App.S_JACKPOT);
    spinsElement = document.querySelector(App.S_SPINS);
    mainElement = document.querySelector(App.S_MAIN);

    // State:
    // TODO: Create constants for all these numbers...
    coins = parseInt(localStorage.coins, 10) || 100;
    jackpot = parseInt(localStorage.jackpot, 10) || 1000;
    spins = parseInt(localStorage.spins, 10) || 0;
    lastSpin = localStorage.lastSpin || 0;

    constructor() {
        const now = Date.now();

        if (now - this.lastSpin >= App.ONE_DAY) {
            localStorage.jackpot = this.jackpot = Math.max(500, this.jackpot - 500 + Math.random() * 1000) | 0;
            localStorage.lastSpin = now;
        }

        // eslint-disable-next-line no-new
        new SlotMachine(
            this.mainElement,
            this.handleUseCoin.bind(this),
            this.handleGetPrice.bind(this),
            5,
            SYMBOLS_RANDOM,
        );

        this.refreshView();
    }

    handleUseCoin() {
        localStorage.coins = this.coins = Math.max(this.coins - 1, 0) || 100;
        localStorage.jackpot = ++this.jackpot;
        localStorage.spins = ++this.spins;
        localStorage.lastSpin = this.lastSpin = Date.now();

        this.refreshView();
    }

    handleGetPrice(fixedPrize, jackpotPercentage) {
        const price = fixedPrize + Math.round(jackpotPercentage * this.jackpot);

        localStorage.jackpot = this.jackpot = Math.max(this.jackpot - price, 0) || 1000;
        localStorage.coins = this.coins += price;

        this.refreshView();
    }

    refreshView() {
        this.coinsElement.innerText = this.coins;
        this.jackpotElement.innerText = this.jackpot;
        this.spinsElement.innerText = this.spins;
    }

}
