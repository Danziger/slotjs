export const SYMBOLS_CLASSIC = [
    '🍋', '🍊', '🍉', '🍈', '🍇', '🥝', '🍓', '🍒', '🌟', '🍀', '💎', '🎰'];

export const SYMBOLS_CHRISTMAS = [
    '🧣', '⛄', '🎄', '🎁', '🎀', '🍾', '🍷', '🔔', '🌟', '🦌', '🎅'];

export const SYMBOLS_HALLOWEEN = [
    '🌚', '🎃', '🦇', '😈', '🧠', '👹', '👽', '🤡', '👻', '🧟‍', '🧛‍', '💀'];

export const SYMBOLS_ANIMALS = [
    '🐞', '🐟', '🐭', '🐸', '🐓', '🐷', '🦀', '🐍', '🦊‍', '🦁', '🦕', '🦖'];

export const SYMBOLS_SPORTS = [
    '🎯', '🎱', '🏐', '⛳', '⚾', '🏈', '🏀', '⚽', '🥉', '🥈', '🥇', '🏆'];

export const SYMBOLS_LOVE = [
    '💌', '🎁', '📸', '💘', '💋', '🔞', '💑', '💍', '💎', '💖',
];

export const SYMBOLS_FORTUNE = [
    '🎴', '🎲', '🕶', '🥃', '💷', '💴', '💵', '💰', '🍀', '💎', '🎰', '🧞‍️', '🃏'];

export const SYMBOLS_FOOD = [
    '🥦', '🍋', '🍆', '🍙', '🍯', '🍑', '🍓', '🍭', '🍫', '🍩', '🍕', '🍗', '🥩', '🍣',
];

export const ALL_SYMBOLS = [
    SYMBOLS_CLASSIC,
    SYMBOLS_CHRISTMAS,
    SYMBOLS_HALLOWEEN,
    SYMBOLS_ANIMALS,
    SYMBOLS_SPORTS,
    SYMBOLS_LOVE,
    SYMBOLS_FORTUNE,
    SYMBOLS_FOOD,
];

export const SYMBOLS_RANDOM = ALL_SYMBOLS[Math.random() * ALL_SYMBOLS.length | 0];
