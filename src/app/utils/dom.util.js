export function createElement(className = '', content = '', angle = null) {
    const element = document.createElement('DIV');

    element.className = Array.isArray(className) ? className.join(' ') : className;

    if (typeof content === 'string') {
        element.innerText = content;
    } else if (content) {
        element.appendChild(content);
    }

    if (angle !== null) {
        element.style.transform = `rotate(${ angle }deg)`;
    }

    return element;
}
