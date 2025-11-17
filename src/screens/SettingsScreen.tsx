import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSound } from '../context/SoundContext'; // ✅ import context

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { soundEnabled, toggleSound } = useSound(); // ✅ use global sound state
  const [darkMode, setDarkMode] = React.useState(false); // local for now

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ SETTINGS</Text>

      {/* 🔊 Sound toggle (global) */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Sound</Text>
        <Switch
          value={soundEnabled}
          onValueChange={toggleSound}
          thumbColor={soundEnabled ? '#7b2cff' : '#888'}
        />
      </View>

      {/* 🎨 Theme toggle (local placeholder) */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? '#7b2cff' : '#888'}
        />
      </View>

      {/* 🔙 Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 22,
    color: '#fff',
    marginBottom: 40,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginVertical: 15,
  },
  optionText: {
    fontFamily: 'PressStart2P',
    fontSize: 16,
    color: '#fff',
  },
  backButton: {
    marginTop: 40,
    backgroundColor: '#222',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  backText: {
    fontFamily: 'PressStart2P',
    fontSize: 16,
    color: '#fff',
  },
});