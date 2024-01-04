import { signal, computed } from '@preact/signals';

/* Mock data
 * A deckId is the sha256 of '$title,$category'
 */
const mockDeck = {
    title: 'A mock card deck',
    description: 'This is a mock of a card deck with a few example questions. The aim is to have something to use for designing the application.',
    category: 'mock/examples',
    deck: [
        { sideA: 'Dog', sideB: 'Hund' },
        { sideA: '7 * 2', sideB: '14' },
        { sideA: 'Cat', sideB: 'Katt' },
        { sideA: 'Chicken', sideB: 'Kyckling' },
    ],
};

// TODO: REMOVE!!!
localStorage.setItem(`decks/7f889a100f4ed`, JSON.stringify(mockDeck));

const mockStatistics = {
    deckId: '7f889a100f4ed',
    lastUpdate: null,
    repetitions: 0,
    sideAStartError: [0, 0, 0, 0],
    sideBStartError: [0, 0, 0, 0],
    timeStats: [0, 0, 0],
}

function hashCode(str, seed=0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function getDeckId(deck) {
    return hashCode(`${deck.title}-${deck.category}`).toString(16);
}

/*
 * deck
 */
export function loadDeck(deckId) {
    let result = localStorage.getItem(`decks/${deckId}`);

    if (result == null)
        return null;

    const deck = JSON.parse(result);
    const stats = statistics.value[deckId];
    return {
        deck,
        stats
    }
}

/*
 * deck descriptors
 */
function getDescriptor(deck) {
    return {
        id: getDeckId(deck),
        title: deck.title,
        category: deck.category,
        description: deck.description,
    };
}

export const deckDescriptors = signal([ getDescriptor(mockDeck) ]);

export function loadFromLocalStore() {
    for (let i = 0; i < Window.localStorage.length; i++) {
        const key = Window.localStorage.key(i);
        
        if (key.startsWith("decks/")) {
            const deck = Window.localStorage.getItem(key);
            deckDescriptions.value = [ ...deckDescriptors, getDescriptor(deck)]
        } else if (key.startsWith("statistics/")) {
            
        }
    }
}

/*
 * Deck statistics
 */
export const statistics = signal({
   [getDeckId(mockDeck)]: mockStatistics,
});

export function calculateScore(stats) {
    const sum = (a, b) => a + b;

    if (stats.repetitions == 0)
        return NaN;

    let totalError = 0;
    totalError = stats.sideAStartError.reduce(sum, totalError);
    totalError += stats.sideAStartError.reduce(sum, totalError);
    totalError /= stats.repetitions;
    totalError /= stats.sideAStartError.length;

    return 1.0 - totalError;
}

/*
 * Round
 */
function randomByWeight(weights) {
    /* implementaiton of weighted random algorithm */
    const sum = (a, b) => a + b;
    const totalWeight = weights.reduce(sum, 0);

    if (totalWeight == 0)
        return Math.ceil(Math.random() * weights.length);
    
    const random = Math.ceil(Math.random() * totalWeight);

    let cursor = 0;
    for (let i=0; i < weights.length; i++) {
        cursor += weights[i];
        if (cursor < random)
            continue;
        return i;
    }
}

export function getNextCardFromDeck(stats, previousIndex) {
    const weights = [...stats.sideAStartError, ...stats.sideBStartError];

    const previousIndexCard = previousIndex && previousIndex % stats.sideAStartError.length || null;
    let indexCard = previousIndex
    let index = null;

    while (previousIndexCard == indexCard) {
        const useRandomByWeights = (Math.random() * 2) >= 1.0; 

        if (!useRandomByWeights)
            index = Math.ceil(Math.random() * weights.length);
        else
            index = randomByWeight(weights);

        indexCard = index % stats.sideAStartError.length;
    }

    return index;
}
