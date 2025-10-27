export type Card = {
  id: number;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export function generateDeck(rows: number, cols: number): Card[] {
  const total = rows * cols;
  const pairs = Math.floor(total / 2);
  const deck: Card[] = [];
  let idCounter = 0;

  for (let p = 0; p < pairs; p++) {
    deck.push({ id: idCounter++, pairId: p, isFlipped: false, isMatched: false });
    deck.push({ id: idCounter++, pairId: p, isFlipped: false, isMatched: false });
  }

  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
