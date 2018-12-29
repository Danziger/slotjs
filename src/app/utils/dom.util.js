export function createElement(className = '', content = '', angle = null) {
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
