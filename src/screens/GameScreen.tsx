import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Text, Modal, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width * 0.25, 100);

// Assets
const cardBack = require('../../assets/cards/card.png');
const starFront = require('../../assets/cards/star.png');
const butterflyFront = require('../../assets/cards/butterfly.png');
const heartFront = require('../../assets/cards/heart.png');
const musicFront = require('../../assets/cards/musicsymbol.png');
const leafFront = require('../../assets/cards/leaf.png');
const moonFront = require('../../assets/cards/moon.png');
const flowerFront = require('../../assets/cards/flower.png');
const triangleFront = require('../../assets/cards/triangle.png');

// Quiz question type
type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

const quizQuestions: QuizQuestion[] = [
  { question: "Which hook is used for state in React Native?", options: ["useEffect", "useState", "useContext"], correctIndex: 1 },
  { question: "Which component is used for scrollable lists?", options: ["FlatList", "ScrollView", "SectionList"], correctIndex: 0 },
  { question: "Which command starts a new React Native project?", options: ["npx react-native init", "npm start", "expo build"], correctIndex: 0 },
  { question: "Which prop controls text content in a <Text> component?", options: ["label", "children", "value"], correctIndex: 1 },
];

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
  matched: boolean;
  pairId: number;
};

export default function GameScreen({ navigation, route }: any) {
  const level: number = route?.params?.level ?? 1;
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Quiz state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reshuffleRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty scaling
  const baseTime = 30;
  const timeReduction = Math.min((level - 1) * 2, 20);
  const levelTime = level === 9999 ? Infinity : baseTime - timeReduction;

  const baseShuffle = 10;
  const shuffleReduction = Math.min((level - 1) * 2, 6);
  const shuffleInterval = level === 9999 ? 5 : baseShuffle - shuffleReduction;

  const allFronts = [starFront, butterflyFront, heartFront, musicFront, leafFront, moonFront, flowerFront, triangleFront];

  const buildDeck = () => {
    let availableFronts = [starFront, butterflyFront, heartFront, musicFront, leafFront];

    if (level >= 3 || level === 9999) availableFronts.push(moonFront);
    if (level >= 4 || level === 9999) availableFronts.push(flowerFront);
    if (level >= 5 || level === 9999) availableFronts.push(triangleFront);

    let symbolCount = Math.min(4 + (level - 1), availableFronts.length);
    if (level === 9999) symbolCount = availableFronts.length;

    const selectedFronts = availableFronts.slice(0, symbolCount);

    const pairCards: Card[] = selectedFronts.flatMap((img, idx) => [
      { id: idx * 2, image: img, flipped: false, matched: false, pairId: idx },
      { id: idx * 2 + 1, image: img, flipped: false, matched: false, pairId: idx },
    ]);

    return shuffleArray(pairCards);
  };

  const initGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (reshuffleRef.current) clearInterval(reshuffleRef.current);

    setCards(buildDeck());
    setFlippedIndices([]);
    setTimeLeft(levelTime);
    setScore(0);
    setShowLoseModal(false);
    setShowWinModal(false);
    setShowQuestionModal(false);

    if (level !== 9999) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 11) {
            const randomQ = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
            setCurrentQuestion(randomQ);
            setShowQuestionModal(true);
            setQuestionTimeLeft(15);
            setQuestionAnswered(false);
          }
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            clearInterval(reshuffleRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    reshuffleRef.current = setInterval(() => {
      setCards(prev => shuffleArray([...prev]));
    }, shuffleInterval * 1000);
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (reshuffleRef.current) clearInterval(reshuffleRef.current);
    };
  }, [level]);

  useEffect(() => {
    if (timeLeft === 0 && !showWinModal && level !== 9999) {
      setShowLoseModal(true);
    }
  }, [timeLeft, showWinModal, level]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched) && level !== 9999) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (reshuffleRef.current) clearInterval(reshuffleRef.current);
      setShowWinModal(true);
    }
  }, [cards]);

  // Quiz countdown
  useEffect(() => {
    let qTimer: NodeJS.Timeout;
    if (showQuestionModal && !questionAnswered) {
      qTimer = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(qTimer);
            handleAnswer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(qTimer);
  }, [showQuestionModal, questionAnswered]);

  const handleAnswer = (isCorrect: boolean) => {
    setQuestionAnswered(true);
    setShowQuestionModal(false);
    if (isCorrect) setTimeLeft(prev => prev + 10);
    else setTimeLeft(prev => Math.max(prev - 10, 0));
  };

  const handleCardPress = (id: number) => {
    if ((timeLeft <= 0 && level !== 9999) || showLoseModal || showWinModal || showQuestionModal) return;

    const index = cards.findIndex(c => c.id === id);
    if (index === -1) return;
    if (cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        if (level === 9999) {
          // Endless Mode: score + replace pair
          setScore(prev => prev + 10);
          const updated = [...newCards];
          updated[firstIdx] = null as any;
          updated[secondIdx] = null as any;
          const remaining = updated.filter(c => c !== null);

          const randomImg = allFronts[Math.floor(Math.random() * allFronts.length)];
                    const newPairId = Math.random();
          const newPair: Card[] = [
            { id: Date.now(), image: randomImg, flipped: false, matched: false, pairId: newPairId },
            { id: Date.now() + 1, image: randomImg, flipped: false, matched: false, pairId: newPairId },
          ];

          setCards(shuffleArray([...remaining, ...newPair]));
          setFlippedIndices([]);
        } else {
          // Normal levels: mark as matched and continue toward win
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setCards(newCards);
          setFlippedIndices([]);
        }
      } else {
        // Not a match: flip them back
        setTimeout(() => {
          const reset = [...newCards];
          reset[firstIdx].flipped = false;
          reset[secondIdx].flipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {level === 9999 ? `ENDLESS MODE — Score: ${score}` : `LEVEL ${level}`}
      </Text>
      {level !== 9999 && <Text style={styles.timer}>Time Left: {timeLeft}s</Text>}

      <View style={styles.grid}>
        {cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardWrapper}
            onPress={() => handleCardPress(card.id)}
            activeOpacity={0.8}
            disabled={
              (timeLeft <= 0 && level !== 9999) ||
              showLoseModal ||
              showWinModal ||
              showQuestionModal
            }
          >
            <Image
              source={card.flipped || card.matched ? card.image : cardBack}
              style={styles.card}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Lose Modal */}
      <Modal visible={showLoseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⛔ Time’s Up!</Text>
            <Pressable style={styles.button} onPress={initGame}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Win Modal */}
      <Modal visible={showWinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                setShowWinModal(false);
                setTimeLeft(levelTime);
                navigation.replace('GameScreen', { level: level + 1 });
              }}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal visible={showQuestionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚡ Quick Question!</Text>
            {currentQuestion && (
              <>
                <Text style={{ color: '#fff', marginBottom: 10 }}>
                  {currentQuestion.question}
                </Text>
                <Text style={{ color: '#ff4444', marginBottom: 10 }}>
                  Time Left: {questionTimeLeft}s
                </Text>

                {currentQuestion.options.map((opt, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.button}
                    onPress={() => handleAnswer(idx === currentQuestion.correctIndex)}
                  >
                    <Text style={styles.buttonText}>{opt}</Text>
                  </Pressable>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>
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
  title: { fontSize: 18, color: '#fff', marginBottom: 10 },
  timer: { fontSize: 14, color: '#ff4444', marginBottom: 10 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width * 0.9,
  },
  cardWrapper: { margin: 8 },
  card: { width: CARD_SIZE, height: CARD_SIZE },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginVertical: 6,
    width: '90%',
    alignItems: 'center',
  },
  backButton: { backgroundColor: '#555' },
  buttonText: { fontSize: 14, color: '#fff' },
});