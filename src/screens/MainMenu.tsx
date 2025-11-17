import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { useSound } from '../context/SoundContext'; // ✅ use global sound context

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const { width, height } = Dimensions.get('window');
const BUTTON_WIDTH = Math.min(width * 0.65, 300);

export default function MainMenu({ navigation }: Props) {
  const [bgSound, setBgSound] = useState<Audio.Sound | null>(null);
  const { soundEnabled } = useSound(); // ✅ global sound toggle

  // ✅ Background music logic
  useEffect(() => {
    let isMounted = true;

    async function setupMusic() {
      if (bgSound) {
        await bgSound.unloadAsync(); // 🔁 stop previous sound
        setBgSound(null);
      }

      if (soundEnabled) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/mainmenuBG.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        if (isMounted) {
          setBgSound(sound);
          await sound.playAsync();
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

  // ✅ Button click sound
  async function playSelectSound() {
    if (!soundEnabled) return;
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/select.mp3')
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  }

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
          style={[styles.button, styles.exitButton]}
          onPress={playSelectSound}
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