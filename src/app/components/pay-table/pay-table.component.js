export class PayTable {

    // CSS classes:
    static C_BASE = 'pt__base';
    static C_ACTIVE = 'pt__base--activeC';
    static C_COLUMN = 'pt__c';

    // CSS selectors:
    static S_ROOT = '.pt__base';
    static S_HEADER = '.pt__header';
    static S_INITIALLY_ACTIVE_COLUMN = '.pt__header .pt__c2';

    // Elements:
    root = document.querySelector(PayTable.S_ROOT);

    // State:
    payMatrix = {};
    activeColumn = null;

    constructor(symbols) {
        const total = symbols.length;

        const headerHTML = `
            <li class="pt__header">
                <div class="pt__rowContent">
                    <span class="pt__c1"></span>
                    <button class="pt__c2 pt__tab"><span class="pt__tabText">× 3</span></button>
                    <button class="pt__c3 pt__tab"><span class="pt__tabText">× 4</span></button>
                    <button class="pt__c4 pt__tab"><span class="pt__tabText">× 5</span></button>
                </div>
            </li>
        `;

        this.root.innerHTML = headerHTML + symbols.map((symbol, i) => {
            const figureWeight = (i + 1) / total * 100;
            const pay3 = figureWeight * 0.6;
            const pay4 = figureWeight * 0.8;
            const pay5 = figureWeight;

            this.payMatrix[symbol] = [pay3, pay4, pay5];

            return `
                <li class="pt__row">
                    <div class="pt__rowContent">
                        <span class="pt__c1">${ symbol }</span>
                        <span class="pt__c2">${ pay3.toFixed(2) } %</span>
                        <span class="pt__c3">${ pay4.toFixed(2) } %</span>
                        <span class="pt__c4">${ pay5.toFixed(2) } %</span>
                    </div>
                </li>
            `;
        }).join('');

        this.activeColumn = this.root.querySelector(PayTable.S_INITIALLY_ACTIVE_COLUMN);

        this.root.querySelector(PayTable.S_HEADER).addEventListener('click', this.handleColumnClicked.bind(this));
    }

    handleColumnClicked({ target }) {
        const column = parseInt(target.className.replace(PayTable.C_COLUMN, ''), 10) || 0;

        if (column <= 1 || target === this.activeColumn) return;

        this.activeColumn = target;

        this.root.className = `${ PayTable.C_BASE } ${ PayTable.C_ACTIVE }${ column }`;

        document.activeElement.blur();
    }

}
