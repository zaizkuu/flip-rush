import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.38, 140);
const CARD_HEIGHT = 60;

// List of topics for the pop-up
const TOPICS = [
  "MIXED (ALL)",
  "General Knowledge",
  "Programming",
  "Mathematics",
  "Science",
  "Philippine History"
];

export default function LevelSelect({ navigation }: any) {
  const [highestLevel, setHighestLevel] = useState(1);
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // Controls the pop-up

  const totalQuestions = 300; 
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        try {
          const savedLevel = await AsyncStorage.getItem('HIGHEST_LEVEL_UNLOCKED');
          if (savedLevel) {
            const parsed = parseInt(savedLevel, 10);
            if (!isNaN(parsed)) setHighestLevel(parsed);
          } else {
            setHighestLevel(1);
          }

          const savedKnowledge = await AsyncStorage.getItem('KNOWLEDGE_TEST_CORRECT');
          if (savedKnowledge) {
            const parsedList = JSON.parse(savedKnowledge);
            setKnowledgeScore(parsedList.length);
          } else {
            setKnowledgeScore(0);
          }
        } catch (error) {
          console.error("Failed to load progress", error);
        }
      };
      loadProgress();
    }, [])
  );

  // Handle picking a topic
  const handleTopicSelect = (topic: string) => {
    setModalVisible(false); // Close the pop-up
    // Go to GameScreen with level 8888 AND the selected topic
    navigation.navigate('GameScreen', { level: 8888, topic: topic });
  };

  const levelRows = [];
  for (let i = 0; i < levels.length; i += 2) {
    levelRows.push(levels.slice(i, i + 2));
  }

  const isEndlessLocked = highestLevel <= 10; 

  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SELECT LEVEL</Text>

        {/* Grid of Levels 1-10 */}
        {levelRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((lvl) => {
              const isLocked = lvl > highestLevel;
              return (
                <Pressable
                  key={lvl}
                  style={[styles.card, isLocked && styles.lockedCard]}
                  disabled={isLocked}
                  onPress={() => navigation.navigate('GameScreen', { level: lvl })}
                >
                  <Text style={[styles.cardText, isLocked && styles.lockedText]}>
                    {isLocked ? `Level ${lvl} 🔒` : `Level ${lvl}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* Endless Mode Button */}
        <Pressable
          style={[styles.card, styles.endlessCard, isEndlessLocked && styles.lockedCard]}
          disabled={isEndlessLocked}
          onPress={() => navigation.navigate('GameScreen', { level: 9999 })}
        >
          <Text style={[styles.cardText, isEndlessLocked && styles.lockedText]}>
            {isEndlessLocked ? 'Endless Mode 🔒' : 'Endless Mode'}
          </Text>
        </Pressable>

        {/* 🆕 KNOWLEDGE TEST BUTTON (Opens Modal) */}
        <Pressable
          style={[styles.card, styles.knowledgeCard]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.cardText}>KNOWLEDGE TEST</Text>
          <Text style={styles.subText}>
            Mastered: {knowledgeScore} / {totalQuestions}+
          </Text>
        </Pressable>

        {/* Game Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Flip Rush is a fast-paced memory game where you flip cards to find matching pairs. Each level introduces new symbols and layouts. The Knowledge Test allows you to challenge yourself with college-level questions across Mathematics, Science, Programming, History, and General Knowledge!
          </Text>
        </View>
      </ScrollView>

      {/* 📚 TOPIC SELECTION POP-UP */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick a Subject</Text>
            
            <ScrollView style={{ width: '100%' }}>
              {TOPICS.map((topic) => (
                <Pressable 
                  key={topic} 
                  style={[
                    styles.topicButton, 
                    topic === "MIXED (ALL)" && styles.mixedButton
                  ]}
                  onPress={() => handleTopicSelect(topic)}
                >
                  <Text style={[
                    styles.buttonText, 
                    topic === "MIXED (ALL)" && { color: '#d0aaff' }
                  ]}>
                    {topic}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
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
  lockedCard: {
    backgroundColor: '#333',
    borderColor: '#555',
    borderWidth: 1,
  },
  cardText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PressStart2P',
    textAlign: 'center',
  },
  subText: {
    fontSize: 8,
    color: '#ffd700',
    fontFamily: 'PressStart2P',
    marginTop: 6,
  },
  lockedText: {
    color: '#777',
  },
  endlessCard: {
    backgroundColor: '#555',
    width: CARD_WIDTH * 2 + 20,
    marginTop: 20,
    marginBottom: 10,
  },
  knowledgeCard: {
    backgroundColor: '#7b2cff',
    width: CARD_WIDTH * 2 + 20,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#9d63ff'
  },
  descriptionContainer: {
    width: '90%',
    paddingHorizontal: 15,
    marginTop: 30,
  },
  descriptionText: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'PressStart2P',
    textAlign: 'center',
    lineHeight: 18,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#444'
  },
  modalTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'PressStart2P',
  },
  topicButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555'
  },
  mixedButton: {
    backgroundColor: '#2a0044',
    borderColor: '#7b2cff'
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PressStart2P',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
  },
  closeButtonText: {
    color: '#ff4444',
    fontFamily: 'PressStart2P',
    fontSize: 12,
  },
});