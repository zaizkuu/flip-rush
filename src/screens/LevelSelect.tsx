import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelect'>;

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = Math.min(width * 0.38, 160);
const BUTTON_HEIGHT = 80;

export default function LevelSelect({ navigation }: Props) {
  // Generate Level 1–10 buttons dynamically
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>SELECT LEVEL</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.button, styles.levelButton]}
              onPress={() => navigation.navigate('Game')}
            >
              <Text style={styles.buttonText}>LEVEL {level}</Text>
            </TouchableOpacity>
          ))}

          {/* Endless Mode */}
          <TouchableOpacity
            style={[styles.button, styles.endlessButton]}
            onPress={() => navigation.navigate('Game')}
          >
            <Text style={styles.endlessText}>ENDLESS</Text>
          </TouchableOpacity>

          {/* Challenge Mode */}
          <TouchableOpacity
            style={[styles.button, styles.challengeButton]}
            onPress={() => navigation.navigate('Game')}
          >
            <Text style={styles.challengeText}>CHALLENGE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 22,
    color: '#fff',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    elevation: 6,
  },
  levelButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  buttonText: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: '#7b2cff',
    textAlign: 'center',
  },
  endlessButton: {
    backgroundColor: '#000',
    borderColor: '#fff',
  },
  endlessText: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  challengeButton: {
    backgroundColor: '#ffcc00',
    borderColor: '#000',
  },
  challengeText: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});
