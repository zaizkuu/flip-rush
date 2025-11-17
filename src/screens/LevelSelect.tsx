import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.38, 140);
const CARD_HEIGHT = 60;

export default function LevelSelect({ navigation }: any) {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  const levelRows = [];
  for (let i = 0; i < levels.length; i += 2) {
    levelRows.push(levels.slice(i, i + 2));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SELECT LEVEL</Text>

      {levelRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((lvl) => (
            <Pressable
              key={lvl}
              style={styles.card}
              onPress={() => navigation.navigate('GameScreen', { level: lvl })}
            >
              <Text style={styles.cardText}>Level {lvl}</Text>
            </Pressable>
          ))}
        </View>
      ))}

      <Pressable
        style={[styles.card, styles.endlessCard]}
        onPress={() => navigation.navigate('GameScreen', { level: 9999 })}
      >
        <Text style={styles.cardText}>Endless Mode</Text>
      </Pressable>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Flip Rush is a fast-paced memory game where you flip cards to find matching pairs. Each level introduces new symbols and layouts to challenge your recall and speed. Levels 1–10 are handcrafted puzzles with increasing difficulty. Endless Mode features randomized grids and escalating complexity. Match quickly, think fast, and unlock new symbols as you progress!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#111',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'PressStart2P',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ff4444',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PressStart2P',
    textAlign: 'center',
  },
  endlessCard: {
    backgroundColor: '#555',
    width: CARD_WIDTH * 2 + 20,
    marginTop: 30,
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '90%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 10,
    color: '#aaa',
    fontFamily: 'PressStart2P',
    textAlign: 'center',
    lineHeight: 18,
  },
});