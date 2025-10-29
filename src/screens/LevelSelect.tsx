import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width * 0.25, 100);

export default function LevelSelect({ navigation }: any) {
  // Generate levels 1–10
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SELECT LEVEL</Text>

      {levels.map((lvl) => (
        <Pressable
          key={lvl}
          style={styles.button}
          onPress={() => navigation.navigate('GameScreen', { level: lvl })}
        >
          <Text style={styles.buttonText}>Level {lvl}</Text>
        </Pressable>
      ))}

      {/* Endless Mode */}
      <Pressable
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.navigate('GameScreen', { level: 9999 })}
      >
        <Text style={styles.buttonText}>Endless Mode</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#111', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 40 
  },
  title: { fontSize: 18, color: '#fff', marginBottom: 10 },
  timer: { fontSize: 14, color: '#ff4444', marginBottom: 10 },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    maxWidth: width * 0.9 
  },
  cardWrapper: { margin: 8 },
  card: { width: CARD_SIZE, height: CARD_SIZE },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#222', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '70%' 
  },
  modalTitle: { 
    fontSize: 16, 
    color: '#fff', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#ff4444', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 6, 
    marginVertical: 5, 
    width: '80%', 
    alignItems: 'center' 
  },
  backButton: { backgroundColor: '#555' },
  buttonText: { fontSize: 14, color: '#fff' },
});