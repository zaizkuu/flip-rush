import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Text, Modal, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width * 0.25, 100);

// --- ASSETS ---
const cardBack = require('../../assets/cards/card.png');
const starFront = require('../../assets/cards/star.png');
const butterflyFront = require('../../assets/cards/butterfly.png');
const heartFront = require('../../assets/cards/heart.png');
const musicFront = require('../../assets/cards/musicsymbol.png');
const leafFront = require('../../assets/cards/leaf.png');
const moonFront = require('../../assets/cards/moon.png');
const flowerFront = require('../../assets/cards/flower.png');
const triangleFront = require('../../assets/cards/triangle.png');

// --- TYPES ---
type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Card = {
  id: number;
  image: any;
  flipped: boolean;
  matched: boolean;
  pairId: number;
};

// --- COLLEGE LEVEL QUESTION DATABASE ---
const QUESTION_DATABASE: Record<string, QuizQuestion[]> = {
  "Programming": [
    // Data Structures & Algos
    { question: "Worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], correctIndex: 2 },
    { question: "Data structure using LIFO?", options: ["Queue", "Stack", "Heap", "Tree"], correctIndex: 1 },
    { question: "Which graph traversal uses a Queue?", options: ["DFS", "BFS", "Dijkstra", "Prim's"], correctIndex: 1 },
    { question: "Searching a sorted array takes?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 1 },
    { question: "Height of a balanced binary tree?", options: ["n", "log n", "n log n", "n^2"], correctIndex: 1 },
    { question: "What resolves hash collisions?", options: ["Chaining", "Stacking", "Queueing", "Mapping"], correctIndex: 0 },
    // Web & Frameworks
    { question: "What prevents prop drilling in React?", options: ["Redux/Context", "Props", "State", "Hooks"], correctIndex: 0 },
    { question: "Which hook handles side effects?", options: ["useState", "useReducer", "useEffect", "useMemo"], correctIndex: 2 },
    { question: "Result of '2' + 2 in JS?", options: ["4", "22", "NaN", "Error"], correctIndex: 1 },
    { question: "Result of '2' - 2 in JS?", options: ["0", "22", "NaN", "Error"], correctIndex: 0 },
    { question: "What is a Closure?", options: ["Object", "Function+Lexical Env", "Class", "Variable"], correctIndex: 1 },
    { question: "Event Loop handles?", options: ["Heap", "Call Stack", "Async Callbacks", "DOM"], correctIndex: 2 },
    { question: "REST API idempotent method?", options: ["POST", "PUT", "PATCH", "CONNECT"], correctIndex: 1 },
    { question: "GraphQL solves what issue?", options: ["Over-fetching", "Security", "Styling", "Database locks"], correctIndex: 0 },
    { question: "CSS Box Model order (in-out)?", options: ["Margin,Border,Pad", "Content,Pad,Border,Margin", "Border,Pad,Content", "Pad,Margin,Content"], correctIndex: 1 },
    // Low Level / Systems
    { question: "What stores local variables?", options: ["Heap", "Stack", "Data Segment", "Register"], correctIndex: 1 },
    { question: "What is a segmentation fault?", options: ["Memory access error", "Disk error", "Network error", "CPU error"], correctIndex: 0 },
    { question: "Race condition occurs when?", options: ["Threads read/write same data", "Network is slow", "CPU overheats", "Disk is full"], correctIndex: 0 },
    { question: "Docker uses?", options: ["Hypervisors", "OS-level Virtualization", "Hardware Emulation", "Interpreters"], correctIndex: 1 },
    { question: "Function of a Linker?", options: ["Compile code", "Combine object files", "Debug code", "Execute code"], correctIndex: 1 },
    // OOP & Design Patterns
    { question: "SOLID: 'O' stands for?", options: ["Object Oriented", "Open/Closed", "Overload", "Output"], correctIndex: 1 },
    { question: "Singleton pattern ensures?", options: ["One instance", "Global access", "Thread safety", "Encapsulation"], correctIndex: 0 },
    { question: "Polymorphism allows?", options: ["Multiple forms", "Data hiding", "Inheritance", "Speed"], correctIndex: 0 },
    { question: "MVC: Logic goes where?", options: ["Model", "View", "Controller", "Database"], correctIndex: 2 },
    { question: "Dependency Injection is?", options: ["Hardcoding", "Inversion of Control", "Inheritance", "Polymorphism"], correctIndex: 1 },
    // Database
    { question: "ACID: 'I' stands for?", options: ["Integrity", "Isolation", "Index", "Input"], correctIndex: 1 },
    { question: "Which is a Columnar DB?", options: ["MySQL", "Cassandra", "MongoDB", "Redis"], correctIndex: 1 },
    { question: "Normalization reduces?", options: ["Speed", "Redundancy", "Security", "Tables"], correctIndex: 1 },
    { question: "SQL: HAVING vs WHERE?", options: ["Same thing", "HAVING is for groups", "WHERE is slower", "HAVING is faster"], correctIndex: 1 },
    { question: "CAP Theorem constraints?", options: ["2 of 3", "3 of 3", "1 of 3", "None"], correctIndex: 0 }
  ],
  "General Knowledge": [
    // Philosophy & Literature
    { question: "Author of 'The Prince'?", options: ["Plato", "Machiavelli", "Dante", "Homer"], correctIndex: 1 },
    { question: "Philosophy of Stoicism?", options: ["Pleasure", "Endurance/Virtue", "Nihilism", "Religion"], correctIndex: 1 },
    { question: "Author of 'Das Kapital'?", options: ["Lenin", "Marx", "Stalin", "Engels"], correctIndex: 1 },
    { question: "Sartre is associated with?", options: ["Existentialism", "Realism", "Surrealism", "Cubism"], correctIndex: 0 },
    { question: "Who wrote '1984'?", options: ["Huxley", "Orwell", "Bradbury", "Tolstoy"], correctIndex: 1 },
    // History & Politics
    { question: "Treaty ending WWI?", options: ["Versailles", "Tordesillas", "Paris", "Ghent"], correctIndex: 0 },
    { question: "Year of the French Revolution?", options: ["1776", "1789", "1812", "1492"], correctIndex: 1 },
    { question: "Defeated at Waterloo?", options: ["Napoleon", "Hitler", "Caesar", "Alexander"], correctIndex: 0 },
    { question: "Cold War ideology clash?", options: ["Fascism/Communism", "Capitalism/Communism", "Monarchy/Democracy", "Theocracy/Secularism"], correctIndex: 1 },
    { question: "Longest reigning UK monarch?", options: ["Victoria", "Elizabeth II", "George III", "Henry VIII"], correctIndex: 1 },
    // Arts & Culture
    { question: "Painter of 'Guernica'?", options: ["Dali", "Picasso", "Monet", "Van Gogh"], correctIndex: 1 },
    { question: "Architect of St. Paul's?", options: ["Wren", "Brunelleschi", "Gaudí", "Wright"], correctIndex: 0 },
    { question: "Composer of 'The Four Seasons'?", options: ["Bach", "Vivaldi", "Mozart", "Beethoven"], correctIndex: 1 },
    { question: "Movement of Salvador Dali?", options: ["Impressionism", "Surrealism", "Cubism", "Realism"], correctIndex: 1 },
    { question: "Japanese theatre form?", options: ["Kabuki", "Opera", "Ballet", "Mime"], correctIndex: 0 },
    // Geography & Economics
    { question: "Country with most time zones?", options: ["Russia", "France", "USA", "China"], correctIndex: 1 },
    { question: "Currency of Switzerland?", options: ["Euro", "Franc", "Krone", "Dollar"], correctIndex: 1 },
    { question: "Largest GDP (Nominal)?", options: ["China", "USA", "Japan", "Germany"], correctIndex: 1 },
    { question: "Study of population?", options: ["Demography", "Cartography", "Sociology", "Psychology"], correctIndex: 0 },
    { question: "Capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correctIndex: 2 },
    // Anthropology
    { question: "Rosetta Stone language?", options: ["Greek/Egyptian", "Latin/Greek", "Arabic/Latin", "Hebrew/Greek"], correctIndex: 0 },
    { question: "Oldest civilization?", options: ["Sumerian", "Egyptian", "Indus", "Chinese"], correctIndex: 0 },
    { question: "Study of fungi?", options: ["Botany", "Mycology", "Zoology", "Entomology"], correctIndex: 1 },
    { question: "Sapir-Whorf hypothesis?", options: ["Language shapes thought", "Evolution", "Gravity", "Economics"], correctIndex: 0 },
    { question: "Human species name?", options: ["Homo habilis", "Homo sapiens", "Homo erectus", "Homo neanderthalensis"], correctIndex: 1 }
  ],
  "Philippine History": [
    // Pre-Colonial & Spanish
    { question: "Pre-colonial supreme deity?", options: ["Bathala", "Apolaki", "Mayari", "Tala"], correctIndex: 0 },
    { question: "Author of 'Doctrina Christiana'?", options: ["Plasencia", "Chirino", "Morga", "Pigafetta"], correctIndex: 0 },
    { question: "Leader of Tondo Conspiracy?", options: ["Magat Salamat", "Lakandula", "Sulayman", "Dagohoy"], correctIndex: 0 },
    { question: "Longest Spanish Gov-Gen?", options: ["Legazpi", "Dasmarinas", "Basco", "Claveria"], correctIndex: 0 },
    { question: "Who wrote 'Fray Botod'?", options: ["Lopez Jaena", "Del Pilar", "Rizal", "Ponce"], correctIndex: 0 },
    // Revolution & American Era
    { question: "Act creating Phil. Assembly?", options: ["Jones Law", "Philippine Bill 1902", "Hare-Hawes-Cutting", "Tydings-McDuffie"], correctIndex: 1 },
    { question: "Law promising independence?", options: ["Jones Law", "Tydings-McDuffie", "Bell Trade", "Gabriela Act"], correctIndex: 0 },
    { question: "First Senate President?", options: ["Quezon", "Osmena", "Roxas", "Laurel"], correctIndex: 0 },
    { question: "Commander of USAFFE?", options: ["MacArthur", "Wainwright", "Eisenhower", "Pershing"], correctIndex: 0 },
    { question: "Puppet Republic President?", options: ["Laurel", "Vargas", "Aquino", "Abad Santos"], correctIndex: 0 },
    // Post-War & Modern
    { question: "Father of Land Reform?", options: ["Macapagal", "Magsaysay", "Marcos", "Garcia"], correctIndex: 0 },
    { question: "President 'Filipino First'?", options: ["Garcia", "Quirino", "Roxas", "Magsaysay"], correctIndex: 0 },
    { question: "Martial Law Proclamation?", options: ["1081", "1017", "2020", "3030"], correctIndex: 0 },
    { question: "Assassinated in 1983?", options: ["Ninoy Aquino", "Rizal", "Magsaysay", "Enrile"], correctIndex: 0 },
    { question: "First female President?", options: ["Corazon Aquino", "Arroyo", "Santiago", "Marcos"], correctIndex: 0 },
    // Constitution & Law
    { question: "Bill of Rights Article?", options: ["Art II", "Art III", "Art IV", "Art V"], correctIndex: 1 },
    { question: "Legislative power vested in?", options: ["Congress", "President", "Court", "People"], correctIndex: 0 },
    { question: "Commander-in-Chief?", options: ["President", "General", "Defense Sec", "Senate Pres"], correctIndex: 0 },
    { question: "Age for President?", options: ["35", "40", "45", "50"], correctIndex: 1 },
    { question: "Term of Senator?", options: ["3 years", "6 years", "4 years", "9 years"], correctIndex: 1 },
    // Culture & Misc
    { question: "National Artist for Architecture?", options: ["Locsin", "Amorsolo", "Tolentino", "Joaquin"], correctIndex: 0 },
    { question: "Hudhud is an epic from?", options: ["Ifugao", "Bicol", "Mindanao", "Ilocos"], correctIndex: 0 },
    { question: "Barasoain Church location?", options: ["Bulacan", "Cavite", "Manila", "Laguna"], correctIndex: 0 },
    { question: "Spoliarium depicts?", options: ["Gladiators", "Farmers", "Soldiers", "Martyrs"], correctIndex: 0 },
    { question: "First Miss Universe PH?", options: ["Gloria Diaz", "Catriona", "Pia", "Margie"], correctIndex: 0 }
  ],
  "Science": [
    // Biology
    { question: "Process creating ATP?", options: ["Glycolysis", "Cellular Respiration", "Mitosis", "Meiosis"], correctIndex: 1 },
    { question: "DNA base pairing?", options: ["A-T, G-C", "A-G, T-C", "A-C, T-G", "A-U, G-C"], correctIndex: 0 },
    { question: "Mitosis phase chromosomes align?", options: ["Prophase", "Metaphase", "Anaphase", "Telophase"], correctIndex: 1 },
    { question: "Universal blood donor?", options: ["O Negative", "AB Positive", "A Positive", "O Positive"], correctIndex: 0 },
    { question: "Enzyme breaking down starch?", options: ["Amylase", "Pepsin", "Lipase", "Lactase"], correctIndex: 0 },
    // Chemistry
    { question: "Moles = Mass / ?", options: ["Volume", "Molar Mass", "Density", "Avogadro"], correctIndex: 1 },
    { question: "PH < 7 indicates?", options: ["Acidic", "Basic", "Neutral", "Alkaline"], correctIndex: 0 },
    { question: "Bond sharing electrons?", options: ["Covalent", "Ionic", "Hydrogen", "Metallic"], correctIndex: 0 },
    { question: "Avogadro's number?", options: ["6.022 x 10^23", "3.14", "9.8 m/s", "1.6 x 10^-19"], correctIndex: 0 },
    { question: "Oxidation is?", options: ["Loss of electrons", "Gain of electrons", "Gain of protons", "Loss of mass"], correctIndex: 0 },
    // Physics
    { question: "Newton's 2nd Law?", options: ["F=ma", "E=mc^2", "v=d/t", "P=IV"], correctIndex: 0 },
    { question: "Unit of electrical resistance?", options: ["Ohm", "Ampere", "Volt", "Watt"], correctIndex: 0 },
    { question: "Entropy measure of?", options: ["Heat", "Disorder", "Energy", "Work"], correctIndex: 1 },
    { question: "Speed of sound in vacuum?", options: ["343 m/s", "0 m/s", "300k km/s", "Infinite"], correctIndex: 1 },
    { question: "Vector quantity?", options: ["Speed", "Velocity", "Mass", "Temperature"], correctIndex: 1 },
    // Astronomy & Earth
    { question: "Hottest star color?", options: ["Blue", "Red", "Yellow", "White"], correctIndex: 0 },
    { question: "Layer below crust?", options: ["Mantle", "Core", "Atmosphere", "Lithosphere"], correctIndex: 0 },
    { question: "Event Horizon relates to?", options: ["Black Hole", "Supernova", "Comet", "Nebula"], correctIndex: 0 },
    { question: "Most abundant gas in atmosphere?", options: ["Oxygen", "Nitrogen", "Argon", "CO2"], correctIndex: 1 },
    { question: "Theory of universe origin?", options: ["Big Bang", "String Theory", "Relativity", "Evolution"], correctIndex: 0 },
    // Advanced
    { question: "Heisenberg Principle?", options: ["Uncertainty", "Relativity", "Gravity", "Motion"], correctIndex: 0 },
    { question: "Mitochondrial DNA comes from?", options: ["Mother", "Father", "Both", "Random"], correctIndex: 0 },
    { question: "Absolute Zero in Kelvin?", options: ["0 K", "-273 K", "273 K", "100 K"], correctIndex: 0 },
    { question: "First Law of Thermodynamics?", options: ["Conservation Energy", "Entropy", "Zero Temp", "Equilibrium"], correctIndex: 0 },
    { question: "Light acts as?", options: ["Wave & Particle", "Wave only", "Particle only", "Magnetic field"], correctIndex: 0 }
  ],
  "Mathematics": [
    // Calculus
    { question: "Derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "tan(x)", "sec(x)"], correctIndex: 0 },
    { question: "Integral of 1/x?", options: ["ln|x|", "e^x", "x^2", "1"], correctIndex: 0 },
    { question: "Derivative of x^2?", options: ["2x", "x", "2", "x^3"], correctIndex: 0 },
    { question: "Limit 1/x as x->infinity?", options: ["0", "Infinity", "1", "Undefined"], correctIndex: 0 },
    { question: "Chain rule applies to?", options: ["Composite functions", "Products", "Sums", "Limits"], correctIndex: 0 },
    // Linear Algebra
    { question: "Determinant of identity matrix?", options: ["0", "1", "n", "Undefined"], correctIndex: 1 },
    { question: "Dot product of orthogonal vectors?", options: ["0", "1", "Infinity", "-1"], correctIndex: 0 },
    { question: "Matrix multiplication is?", options: ["Commutative", "Associative", "Distributive", "Non-commutative"], correctIndex: 3 },
    { question: "Eigenvalues relate to?", options: ["Trace", "Determinant", "Both", "None"], correctIndex: 2 },
    { question: "Inverse of singular matrix?", options: ["Exists", "Does not exist", "Is 0", "Is 1"], correctIndex: 1 },
    // Statistics & Probability
    { question: "Probability of sum 7 (2 dice)?", options: ["1/6", "1/12", "1/36", "1/8"], correctIndex: 0 },
    { question: "Mean of standard normal dist?", options: ["0", "1", "10", "Undefined"], correctIndex: 0 },
    { question: "Variance is square of?", options: ["Standard Deviation", "Mean", "Mode", "Range"], correctIndex: 0 },
    { question: "Permutation formula?", options: ["n!/(n-r)!", "n!/r!(n-r)!", "n!", "n^r"], correctIndex: 0 },
    { question: "Bayes Theorem relates?", options: ["Conditional Prob", "Independent Events", "Variance", "Means"], correctIndex: 0 },
    // Discrete & Logic
    { question: "P -> Q is false when?", options: ["P true, Q false", "P false, Q true", "Both true", "Both false"], correctIndex: 0 },
    { question: "Modulus 10 % 3?", options: ["1", "3", "0", "2"], correctIndex: 0 },
    { question: "Graph with no cycles?", options: ["Tree", "Cyclic", "Complete", "Mesh"], correctIndex: 0 },
    { question: "Set of all subsets?", options: ["Power Set", "Null Set", "Union", "Intersection"], correctIndex: 0 },
    { question: "Contrapositive of P->Q?", options: ["~Q -> ~P", "Q -> P", "~P -> ~Q", "P and Q"], correctIndex: 0 },
    // Algebra & Trig
    { question: "Log base e is?", options: ["ln", "log10", "exp", "lim"], correctIndex: 0 },
    { question: "sin^2 + cos^2 = ?", options: ["1", "0", "tan^2", "2"], correctIndex: 0 },
    { question: "Quadratic formula root?", options: ["Discriminant", "Determinant", "Derivative", "Divisor"], correctIndex: 0 },
    { question: "i^2 equals?", options: ["-1", "1", "0", "i"], correctIndex: 0 },
    { question: "Factorial 0! equals?", options: ["1", "0", "Undefined", "Infinity"], correctIndex: 0 }
  ]
};

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function GameScreen({ navigation, route }: any) {
  const paramsLevel = route?.params?.level ?? 1;
  const isKnowledgeTest = paramsLevel === 8888;
  const level: number = isKnowledgeTest ? 1 : (typeof paramsLevel === 'string' ? parseInt(paramsLevel, 10) : paramsLevel);

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  
  // Modals
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  
  // --- BOSS QUIZ STATE ---
  const [showBossQuiz, setShowBossQuiz] = useState(false);
  const [bossQuestions, setBossQuestions] = useState<QuizQuestion[]>([]);
  const [currentBossIndex, setCurrentBossIndex] = useState(0);
  const [bossScore, setBossScore] = useState(0);
  const [bossTimer, setBossTimer] = useState(10);
  const [showBossResult, setShowBossResult] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [retriesLeft, setRetriesLeft] = useState(3);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);

  const baseTime = 30;
  const timeIncrease = (level - 1) * 5;
  const levelTime = level === 9999 ? Infinity : baseTime + timeIncrease;

  const allFronts = [starFront, butterflyFront, heartFront, musicFront, leafFront, moonFront, flowerFront, triangleFront];

  const saveKnowledgeProgress = async (correctQuestion: string) => {
    try {
      const saved = await AsyncStorage.getItem('KNOWLEDGE_TEST_CORRECT');
      let correctList = saved ? JSON.parse(saved) : [];
      if (!correctList.includes(correctQuestion)) {
        correctList.push(correctQuestion);
        await AsyncStorage.setItem('KNOWLEDGE_TEST_CORRECT', JSON.stringify(correctList));
      }
    } catch (e) {
      console.error("Failed to save knowledge progress", e);
    }
  };

  const saveProgress = async () => {
    try {
      const savedString = await AsyncStorage.getItem('HIGHEST_LEVEL_UNLOCKED');
      const currentHighest = savedString ? parseInt(savedString, 10) : 1;
      const nextLevel = level + 1;
      if (nextLevel > currentHighest) {
        await AsyncStorage.setItem('HIGHEST_LEVEL_UNLOCKED', nextLevel.toString());
      }
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  };

  const buildDeck = () => {
    let availableFronts = [starFront, butterflyFront, heartFront, musicFront, leafFront];
    if (level >= 3 || level === 9999 || isKnowledgeTest) availableFronts.push(moonFront);
    if (level >= 4 || level === 9999 || isKnowledgeTest) availableFronts.push(flowerFront);
    if (level >= 5 || level === 9999 || isKnowledgeTest) availableFronts.push(triangleFront);

    let symbolCount = Math.min(4 + (level - 1), availableFronts.length);
    if (level === 9999 || isKnowledgeTest) symbolCount = availableFronts.length;

    const selectedFronts = availableFronts.slice(0, symbolCount);
    const pairCards: Card[] = selectedFronts.flatMap((img, idx) => [
      { id: idx * 2, image: img, flipped: false, matched: false, pairId: idx },
      { id: idx * 2 + 1, image: img, flipped: false, matched: false, pairId: idx },
    ]);
    return shuffleArray(pairCards);
  };

  const initGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (isKnowledgeTest) {
      startKnowledgeTest();
      return;
    }

    setCards(buildDeck());
    setFlippedIndices([]);
    setTimeLeft(levelTime);
    setScore(0);
    
    setShowLoseModal(false);
    setShowWinModal(false);
    setShowTopicModal(false);
    setShowBossQuiz(false);
    setShowBossResult(false);
    
    setQuizPassed(false);
    setRetriesLeft(3);

    if (level !== 9999) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const startKnowledgeTest = () => {
    let allQuestions: QuizQuestion[] = [];
    Object.values(QUESTION_DATABASE).forEach(list => {
      allQuestions = [...allQuestions, ...list];
    });
    const shuffled = shuffleArray(allQuestions);
    setBossQuestions(shuffled);
    setCurrentBossIndex(0);
    setBossScore(0);
    setBossTimer(15); 
    setShowBossQuiz(true);
    setSelectedTopic("ALL KNOWLEDGE");
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
    };
  }, [level, isKnowledgeTest]);

  useEffect(() => {
    if (timeLeft === 0 && !showWinModal && !showTopicModal && !showBossQuiz && level !== 9999 && !isKnowledgeTest) {
      setShowLoseModal(true);
    }
  }, [timeLeft, showWinModal, showTopicModal, showBossQuiz, level, isKnowledgeTest]);

  useEffect(() => {
    if (!isKnowledgeTest && cards.length > 0 && cards.every(c => c.matched) && level !== 9999) {
      if (timerRef.current) clearInterval(timerRef.current);
      setShowWinModal(true);
    }
  }, [cards, isKnowledgeTest]);

  const openTopicSelection = () => {
    setShowWinModal(false);
    setShowTopicModal(true);
  };

  const startBossQuiz = (topic: string) => {
    setSelectedTopic(topic);
    setShowTopicModal(false);
    setShowBossResult(false);
    
    const topicQuestions = QUESTION_DATABASE[topic] || [];
    const questionsCount = Math.min(10 + (level - 1), 20);
    const selectedQuestions = shuffleArray(topicQuestions).slice(0, questionsCount);
    
    setBossQuestions(selectedQuestions);
    setCurrentBossIndex(0);
    setBossScore(0);
    setBossTimer(10);
    setShowBossQuiz(true);
  };

  useEffect(() => {
    if (showBossQuiz && !showBossResult) {
      bossTimerRef.current = setInterval(() => {
        setBossTimer((prev) => {
          if (prev <= 1) {
            handleBossAnswer(false); 
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
    };
  }, [showBossQuiz, showBossResult, currentBossIndex]);

  const handleBossAnswer = (isCorrect: boolean) => {
    if (bossTimerRef.current) clearInterval(bossTimerRef.current);

    if (isCorrect) {
      setBossScore(prev => prev + 1);
      if (isKnowledgeTest) {
        saveKnowledgeProgress(bossQuestions[currentBossIndex].question);
      }
    }

    if (currentBossIndex + 1 < bossQuestions.length) {
      setCurrentBossIndex(prev => prev + 1);
      setBossTimer(10); 
    } else {
      finishBossQuiz(isCorrect ? bossScore + 1 : bossScore);
    }
  };

  const finishBossQuiz = (finalScore: number) => {
    setShowBossQuiz(false);
    const total = bossQuestions.length;
    
    if (isKnowledgeTest) {
      setQuizPassed(true);
      setShowBossResult(true);
      return;
    }

    const passed = total > 0 && (finalScore / total) >= 0.8;
    setQuizPassed(passed);
    
    if (passed) {
      saveProgress(); 
    } else {
      setRetriesLeft(prev => prev - 1);
    }
    setShowBossResult(true);
  };

  const handleCardPress = (id: number) => {
    if ((timeLeft <= 0 && level !== 9999) || showLoseModal || showWinModal || showTopicModal || showBossQuiz) return;

    const index = cards.findIndex(c => c.id === id);
    if (index === -1) return;
    if (cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedIndices([...flippedIndices, index]);

    if (flippedIndices.length === 1) {
      const firstIdx = flippedIndices[0];
      if (newCards[firstIdx].pairId === newCards[index].pairId) {
        if (level === 9999) {
           setScore(s => s + 10);
           const updated = [...newCards];
           updated[firstIdx] = null as any; 
           updated[index] = null as any;
           const remaining = updated.filter(c => c !== null);
           const randomImg = allFronts[Math.floor(Math.random() * allFronts.length)];
           const newPairId = Math.random();
           const newPair = [
             { id: Date.now(), image: randomImg, flipped: false, matched: false, pairId: newPairId },
             { id: Date.now()+1, image: randomImg, flipped: false, matched: false, pairId: newPairId }
           ];
           setCards(shuffleArray([...remaining, ...newPair]));
           setFlippedIndices([]);
        } else {
          newCards[firstIdx].matched = true;
          newCards[index].matched = true;
          setCards(newCards);
          setFlippedIndices([]);
        }
      } else {
        setTimeout(() => {
          const reset = [...newCards];
          reset[firstIdx].flipped = false;
          reset[index].flipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  if (isKnowledgeTest && !showBossQuiz && !showBossResult) {
    return <View style={styles.container}><Text style={{color:'white'}}>Loading Test...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!isKnowledgeTest && (
        <Text style={styles.title}>
          {level === 9999 ? `ENDLESS MODE — Score: ${score}` : `LEVEL ${level}`}
        </Text>
      )}
      {!isKnowledgeTest && level !== 9999 && !showBossQuiz && <Text style={styles.timer}>Time Left: {timeLeft}s</Text>}

      {!isKnowledgeTest && (
        <View style={styles.grid}>
          {cards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardWrapper}
              onPress={() => handleCardPress(card.id)}
              activeOpacity={0.8}
              disabled={
                (timeLeft <= 0 && level !== 9999) ||
                showLoseModal || showWinModal || showTopicModal || showBossQuiz
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
      )}

      {/* LOSE MODAL */}
      <Modal visible={showLoseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⛔ Time’s Up!</Text>
            <Pressable style={styles.button} onPress={initGame}>
              <Text style={styles.buttonText}>Retry Level</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Menu</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* WIN MODAL */}
      <Modal visible={showWinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Level Complete!</Text>
            <Text style={styles.subText}>Select a topic for the final test!</Text>
            <Pressable style={styles.button} onPress={openTopicSelection}>
              <Text style={styles.buttonText}>Select Topic</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* TOPIC SELECTION */}
      <Modal visible={showTopicModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '60%' }]}>
            <Text style={styles.modalTitle}>📚 Pick a Subject</Text>
            <ScrollView style={{ width: '100%' }}>
              {Object.keys(QUESTION_DATABASE).map((topic) => (
                <Pressable key={topic} style={styles.topicButton} onPress={() => startBossQuiz(topic)}>
                  <Text style={styles.buttonText}>{topic}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* BOSS QUIZ */}
      <Modal visible={showBossQuiz} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.quizContent}>
            <Text style={styles.topicBadge}>{selectedTopic}</Text>
            <Text style={styles.modalTitle}>Q: {currentBossIndex + 1} / {bossQuestions.length}</Text>
            <Text style={styles.bossTimer}>⏱ {bossTimer}s</Text>

            {bossQuestions.length > 0 && (
              <>
                <Text style={styles.questionText}>{bossQuestions[currentBossIndex].question}</Text>
                {bossQuestions[currentBossIndex].options.map((opt, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.optionButton}
                    onPress={() => handleBossAnswer(idx === bossQuestions[currentBossIndex].correctIndex)}
                  >
                    <Text style={styles.buttonText}>{opt}</Text>
                  </Pressable>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* RESULT MODAL */}
      <Modal visible={showBossResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isKnowledgeTest ? "📚 Test Complete" : (quizPassed ? "🏆 Level Mastered!" : "❌ Quiz Failed")}
            </Text>
            <Text style={styles.subText}>
              Score: {bossScore} / {bossQuestions.length}
            </Text>

            {!isKnowledgeTest && !quizPassed && retriesLeft > 0 && (
               <Text style={{color: '#aaa', marginBottom: 15}}>Retries Left: {retriesLeft}</Text>
            )}

            {!isKnowledgeTest && !quizPassed && retriesLeft === 0 && (
               <Text style={{color: '#ff4444', marginBottom: 15, fontWeight: 'bold'}}>GAME OVER - RESTART LEVEL</Text>
            )}

            {isKnowledgeTest ? (
               <Pressable style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
                 <Text style={styles.buttonText}>Return to Menu</Text>
               </Pressable>
            ) : quizPassed ? (
              <Pressable
                style={styles.button}
                onPress={() => {
                   setShowBossResult(false);
                   navigation.replace('GameScreen', { level: level + 1 });
                }}
              >
                <Text style={styles.buttonText}>Next Level</Text>
              </Pressable>
            ) : retriesLeft > 0 ? (
              <Pressable style={styles.button} onPress={() => startBossQuiz(selectedTopic)}>
                <Text style={styles.buttonText}>Retry Quiz</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.button} onPress={initGame}>
                <Text style={styles.buttonText}>Restart Level</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 18, color: '#fff', marginBottom: 10, fontFamily: 'PressStart2P' },
  timer: { fontSize: 14, color: '#ff4444', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', maxWidth: width * 0.9 },
  cardWrapper: { margin: 8 },
  card: { width: CARD_SIZE, height: CARD_SIZE },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center', width: '85%', maxWidth: 400, borderWidth: 1, borderColor: '#444' },
  quizContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center', width: '90%', maxWidth: 500, borderWidth: 2, borderColor: '#7b2cff' },
  modalTitle: { fontSize: 18, color: '#fff', marginBottom: 10, textAlign: 'center', fontFamily: 'PressStart2P' },
  subText: { color: '#aaa', textAlign: 'center', marginBottom: 15, fontSize: 12 },
  bossTimer: { color: '#ff4444', marginBottom: 20, fontSize: 18, fontWeight: 'bold' },
  questionText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  topicBadge: { color: '#7b2cff', fontSize: 10, fontFamily: 'PressStart2P', marginBottom: 5, textTransform: 'uppercase' },
  button: { backgroundColor: '#ff4444', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, marginVertical: 6, width: '100%', alignItems: 'center' },
  topicButton: { backgroundColor: '#333', paddingVertical: 15, borderRadius: 8, marginVertical: 5, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#555' },
  optionButton: { backgroundColor: '#333', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 8, marginVertical: 5, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#555' },
  backButton: { backgroundColor: '#555' },
  buttonText: { fontSize: 14, color: '#fff', fontFamily: 'PressStart2P' },
});