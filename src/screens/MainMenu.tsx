import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { useSound } from '../context/SoundContext'; 

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const { width, height } = Dimensions.get('window');
const BUTTON_WIDTH = Math.min(width * 0.65, 300);

export default function MainMenu({ navigation }: Props) {
  const bgSoundRef = useRef<Audio.Sound | null>(null);
  const { soundEnabled } = useSound(); 

  // --- Background Music Logic (Fixed Race Condition) ---
  useEffect(() => {
    let isCancelled = false; // 1. Track if effect is cleaned up

    const manageMusic = async () => {
      // Unload any existing sound first
      if (bgSoundRef.current) {
        try {
          await bgSoundRef.current.stopAsync();
          await bgSoundRef.current.unloadAsync();
          bgSoundRef.current = null;
        } catch (e) { /* ignore */ }
      }

      // If sound is ON, try to load and play
      if (soundEnabled) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/mainmenuBG.mp3'),
            { shouldPlay: true, isLooping: true }
          );

          // 2. ONLY play if the user hasn't turned off sound while loading
          if (!isCancelled && soundEnabled) {
            bgSoundRef.current = sound;
            await sound.playAsync();
          } else {
            // If cancelled, unload immediately
            await sound.unloadAsync();
          }
        } catch (error) {
          console.log("Error loading BG music:", error);
        }
      }
    };

    manageMusic();

    // Cleanup function
    return () => {
      isCancelled = true; // Mark as cancelled
      if (bgSoundRef.current) {
        bgSoundRef.current.stopAsync();
        bgSoundRef.current.unloadAsync();
        bgSoundRef.current = null;
      }
    };
  }, [soundEnabled]); // Re-run when toggle changes

  // --- Button Sound Helper ---
  async function playSelectSound() {
    if (!soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/select.mp3')
      );
      await sound.playAsync();
      
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
        
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={async () => {
            await playSelectSound();
            navigation.navigate('LevelSelect');
          }}
        >
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.settingsButton]}
          onPress={async () => {
            await playSelectSound();
            navigation.navigate('SettingsScreen');
          }}
        >
          <Text style={styles.settingsText}>SETTINGS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.aboutButton]}
          onPress={async () => {
            await playSelectSound();
            navigation.navigate('AboutUs');
          }}
        >
          <Text style={styles.aboutText}>ABOUT US</Text>
        </TouchableOpacity>

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
  titleWrapper: { position: 'absolute', top: height * 0.18 },
  title: { fontFamily: 'PressStart2P', fontSize: 44, color: '#fff' },
  buttonsWrapper: { flex: 1, justifyContent: 'center', marginTop: height * 0.25 },
  button: {
    width: BUTTON_WIDTH,
    paddingVertical: 20,
    marginVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 4,
  },
  startButton: { backgroundColor: '#fff', borderColor: '#000' },
  startText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#7b2cff' },
  
  settingsButton: { backgroundColor: '#000', borderColor: '#fff' },
  settingsText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#fff' },

  aboutButton: { backgroundColor: '#000', borderColor: '#aaa' },
  aboutText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#ddd' },

  exitButton: { backgroundColor: '#000', borderColor: '#000' },
  exitText: { fontFamily: 'PressStart2P', fontSize: 20, color: '#fff' },
});