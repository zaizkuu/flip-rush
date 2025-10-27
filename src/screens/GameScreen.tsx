import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Text } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width * 0.25, 100);

// Assets
const cardBack = require('../../assets/cards/card.png');
const starFront = require('../../assets/cards/star.png');

// Shuffle utility
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Card = {
  id: number;
  image: any;
  flipped: boolean;
};

export default function GameScreen() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    // Example: 6 pairs of star cards → 12 cards total
    const pairCards: Card[] = Array.from({ length: 6 }, (_, idx) => [
      { id: idx * 2, image: starFront, flipped: false },
      { id: idx * 2 + 1, image: starFront, flipped: false },
    ]).flat();

    setCards(shuffleArray(pairCards));
  }, []);

  const handleCardPress = (id: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, flipped: !card.flipped } : card
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME SCREEN</Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardWrapper}
            onPress={() => handleCardPress(card.id)}
            activeOpacity={0.8}
          >
            <Image
              source={card.flipped ? card.image : cardBack}
              style={styles.card}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width * 0.9,
  },
  cardWrapper: {
    margin: 8,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
});