import { useEffect, useRef, useState } from 'react';
import { Card, generateDeck } from './cardUtils';
import { LEVELS } from './levels';

type GameState = {
  deck: Card[];
  selectedIds: number[];
  matchedCount: number;
  timeLeft: number;
  status: 'idle' | 'ready' | 'running' | 'won' | 'lost';
};

export function useGame(levelId: number) {
  const cfg = LEVELS.find(l => l.id === levelId)!;
  const [state, setState] = useState<GameState>({
    deck: [],
    selectedIds: [],
    matchedCount: 0,
    timeLeft: cfg.timeSeconds,
    status: 'idle',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const deck = generateDeck(cfg.rows, cfg.cols);
    setState(s => ({ ...s, deck, status: 'ready', timeLeft: cfg.timeSeconds }));
  }, [levelId]);

  const start = () => {
    if (state.status !== 'ready') return;
    setState(s => ({ ...s, status: 'running' }));
    timerRef.current = setInterval(() => {
      setState(s => {
        const t = s.timeLeft - 1;
        if (t <= 0) {
          clearInterval(timerRef.current!);
          return { ...s, timeLeft: 0, status: 'lost' };
        }
        return { ...s, timeLeft: t };
      });
    }, 1000);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const reset = () => {
    stop();
    const deck = generateDeck(cfg.rows, cfg.cols);
    setState({
      deck,
      selectedIds: [],
      matchedCount: 0,
      timeLeft: cfg.timeSeconds,
      status: 'ready',
    });
  };

  const onFlip = (id: number) => {
    setState(s => {
      if (s.status !== 'running') return s;
      const deck = [...s.deck];
      const idx = deck.findIndex(c => c.id === id);
      if (idx < 0 || deck[idx].isFlipped || deck[idx].isMatched) return s;

      deck[idx].isFlipped = true;
      const selected = [...s.selectedIds, id];

      if (selected.length === 2) {
        const [aId, bId] = selected;
        const a = deck.find(c => c.id === aId)!;
        const b = deck.find(c => c.id === bId)!;

        if (a.pairId === b.pairId) {
          a.isMatched = true;
          b.isMatched = true;
          const matchedCount = s.matchedCount + 2;
          const allMatched = matchedCount === deck.length;
          if (allMatched) {
            stop();
            return { ...s, deck, selectedIds: [], matchedCount, status: 'won' };
          }
          return { ...s, deck, selectedIds: [], matchedCount };
        } else {
          setTimeout(() => {
            setState(s2 => {
              const deck2 = [...s2.deck];
              const a2 = deck2.find(c => c.id === aId)!;
              const b2 = deck2.find(c => c.id === bId)!;
              a2.isFlipped = false;
              b2.isFlipped = false;
              return { ...s2, deck: deck2 };
            });
          }, 600);
          return { ...s, deck, selectedIds: [] };
        }
      }

      return { ...s, deck, selectedIds: selected };
    });
  };

  return { state, cfg, start, reset, onFlip };
  
}
