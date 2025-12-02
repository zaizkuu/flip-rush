import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { useSound } from '../context/SoundContext'; 

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const { width, height } = Dimensions.get('window');
const BUTTON_WIDTH = Math.min(width * 0.65, 300);

export default function MainMenu({ navigation }: Props) {
  const [bgSound, setBgSound] = useState<Audio.Sound | null>(null);
  const { soundEnabled } = useSound(); 

  // --- Background Music Logic ---
  useEffect(() => {
    let isMounted = true;

    async function setupMusic() {
      if (bgSound) {
        await bgSound.unloadAsync(); 
        setBgSound(null);
      }

      if (soundEnabled) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/mainmenuBG.mp3'),
            { shouldPlay: true, isLooping: true }
          );
          if (isMounted) {
            setBgSound(sound);
            await sound.playAsync();
          }
        } catch (error) {
          console.log("Error loading BG music:", error);
        }
      }
    }

    setupMusic();

    return () => {
      isMounted = false;
      if (bgSound) {
        bgSound.unloadAsync();
      }
    };
  }, [soundEnabled]);

  // --- Button Sound Helper ---
  async function playSelectSound() {
    if (!soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/select.mp3')
      );
      await sound.playAsync();
      
      // Unload sound from memory when done playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Error playing select sound:", error);
    }
  }

  // --- Handle Exit ---
  const handleExit = () => {
    playSelectSound();
    // Small delay to allow the sound to play before closing
    setTimeout(() => {
      BackHandler.exitApp();
    }, 400); 
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>FLIP RUSH</Text>
      </View>

      <View style={styles.buttonsWrapper}>
        
        {/* START BUTTON - Goes to Level Select */}
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={async () => {
            await playSelectSound();
            navigation.navigate('LevelSelect');
          }}
        >
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>

        {/* SETTINGS BUTTON */}
        <TouchableOpacity
          style={[styles.button, styles.settingsButton]}
          onPress={async () => {
            await playSelectSound();
            navigation.navigate('SettingsScreen');
          }}
        >
          <Text style={styles.settingsText}>SETTINGS</Text>
        </TouchableOpacity>

        {/* EXIT BUTTON - Now Works! */}
        <TouchableOpacity
          style={[styles.button, styles.exitButton]}
          onPress={handleExit}
        >
          <Text style={styles.exitText}>EXIT</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  titleWrapper: { position: 'absolute', top: height * 0.23 },
  title: { fontFamily: 'PressStart2P', fontSize: 44, color: '#fff' },
  buttonsWrapper: { flex: 1, justifyContent: 'center', marginTop: height * 0.3 },
  button: {
    width: BUTTON_WIDTH,
    paddingVertical: 28,
    marginVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 4,
  },
  startButton: { backgroundColor: '#fff', borderColor: '#000' },
  startText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#7b2cff' },
  settingsButton: { backgroundColor: '#222', borderColor: '#fff' },
  settingsText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#fff' },
  exitButton: { backgroundColor: '#000', borderColor: '#000' },
  exitText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#fff' },
});