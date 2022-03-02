export function capitalize(str = '') {
    const parts = str.toLowerCase().split('-');

    return parts.map((part) => {
        const firstChar = part[0];

        return `${ firstChar.toUpperCase() }${ part.substring(1) }`;
    }).join(' ');
}
