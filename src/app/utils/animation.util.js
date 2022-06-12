let dynamicStyles = null;

export function addAnimation(name, body) {
    if (!dynamicStyles) {
        dynamicStyles = document.createElement('style');
        dynamicStyles.type = 'text/css';
        document.head.appendChild(dynamicStyles);
    }

    dynamicStyles.sheet.insertRule(`@keyframes ${ name } {
        ${ body }
    }`, dynamicStyles.length);
}

export function resetAnimations() {
    if (dynamicStyles) {
        dynamicStyles.remove();

        dynamicStyles = null;
    }
}

export function stopAtAnimation(name, start, end, alpha, speed) {
    const angles = [
        start,
        end - (alpha * 0.25),
        end + (alpha * 0.125),
        end - (alpha * 0.0625),
        end + (alpha * 0.03125),
        end - (alpha * 0.015625),
        end,
    ];

    let previousAngle = start;
    let total = 0;

    const time = angles.map((angle) => {
        const delta = Math.max(Math.abs(angle - previousAngle) / Math.abs(speed), 10);

        previousAngle = angle;
        total += delta;

        return delta;
    });

    let previousPercent = 0;

    const percent = time.map((t) => {
        const p = previousPercent + (100 * t / total);

        previousPercent = p;

        return p;
    });

    const animation = percent.map((p, i) => `${ Math.round(p) }% { transform: rotate(${ angles[i].toFixed(2) }deg); }`).join('\n');

    addAnimation(name, animation);

    return total;
}
