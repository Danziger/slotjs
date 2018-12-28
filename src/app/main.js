const symbols = [
	'🍉',
	'🔔',
	'🍋',
	'🍒',
	'🍇',
	'🍊',
	'🍓',
	'💀',
	'💎',
	'🍀',
];

const alpha = 360 / symbols.length;


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        [a[i], a[j]] = [a[j], a[i]];
    }
    
    return a;
}

function createElement(className = '', content = '', angle = null) {
    const element = document.createElement('DIV');
    
    element.className = className;
    
    if (typeof content === 'string') {
        element.innerText = content;      
    } else {
        element.appendChild(content);
    }
    
    if (angle !== null) {
        element.style.transform = `rotate(${ angle }deg)`;
    }	
    
    return element;
}


const reels = Array
.from(document.querySelectorAll('.reel'))
.slice(0, -1)
.map((reel) => {  
    shuffle(symbols);
    
    symbols.forEach((symbol, i) => {
        const slotText = createElement('cellFigure', symbol);
        const slot = createElement('cell', slotText.cloneNode(true), i * alpha);
        const shadow1 = createElement('cell shadow1', slotText.cloneNode(true), (i + 0.25) * alpha);
        const shadow2 = createElement('cell shadow2', slotText.cloneNode(true), (i + 0.5) * alpha);
        const shadow3 = createElement('cell shadow3', slotText.cloneNode(true), (i + 0.75) * alpha);
        
        // TODO: Do not add so many to the inner-most reels.
        
        reel.appendChild(slot);
        reel.appendChild(shadow1);
        reel.appendChild(shadow2);
        reel.appendChild(shadow3);
    });
    
    return { element: reel, style: reel.style, angle: 0 };
});


function step() {
	requestAnimationFrame(() => {
        // TODO: Calculate increment based on time
        
        // TODO: Use a normal for and keep track of the current index...
        for (const reel of reels) {
            const angle = reel.angle = (360 + (reel.angle - 17)) % 360;
            
            reel.style.transform = `rotate(${ angle }deg)`;
        }
        
        step();  
    });
}

step();

document.onclick = () => {  
	const reelIndex = reels.length - 1;
    // TODO: Do not shift, keep track of index...
    const reel = reels.shift();
    // TODO: Calculate angle based on time
	const angle = reel.angle;  
    const index = (Math.floor(Math.max(0, angle - alpha) / alpha)) % 10;
    const stopAngle = (index * alpha) + alpha;
    
    console.log(reelIndex);
    
    const animationName = `stop-${ reelIndex }`;
    
	stopAt(animationName, stopAngle);
    
    reel.style.animation = `${ animationName } ${ .25 }s linear forwards`;
    reel.element.classList.add('stop');
    
    if (reelIndex === 0) {
        setTimeout(() => document.getElementById('root').classList.add('zoom'), 300);  	
    }
};

let dynamicStyles = null;

function addAnimation(name, body) {
    let style;
    
    if (dynamicStyles) {
        style = dynamicStyles;
    } else {
        dynamicStyles = document.createElement('style');
        dynamicStyles.type = 'text/css';
        document.head.appendChild(dynamicStyles);
        
        style = dynamicStyles;
    }
    
    dynamicStyles.sheet.insertRule(`@keyframes ${ name } {
        ${ body }
    }`, dynamicStyles.length);
}

function stopAt(name, target) {
    addAnimation(name, `
    50% { transform: rotate(${ target - alpha * 0.25 }deg); }
    60% { transform: rotate(${ target + alpha * 0.125 }deg); }
    70% { transform: rotate(${ target - alpha * 0.0625 }deg); }
    80% { transform: rotate(${ target + alpha * 0.03125 }deg); }
    90% { transform: rotate(${ target - alpha * 0.015625 }deg); }
    100% { transform: rotate(${ target }deg); }
    `);
}
