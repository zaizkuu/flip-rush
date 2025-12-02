import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Import AsyncStorage
import { useSound } from '../context/SoundContext'; 

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { soundEnabled, toggleSound } = useSound();
  const [darkMode, setDarkMode] = React.useState(false); 

  // --- Handle Reset Logic ---
  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to delete all unlocked levels? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive", // Red color on iOS
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('HIGHEST_LEVEL_UNLOCKED');
              Alert.alert("Success", "Progress has been reset to Level 1.");
            } catch (error) {
              console.error("Error resetting progress", error);
              Alert.alert("Error", "Failed to reset progress.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ SETTINGS</Text>

      {/* 🔊 Sound toggle */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Sound</Text>
        <Switch
          value={soundEnabled}
          onValueChange={toggleSound}
          thumbColor={soundEnabled ? '#7b2cff' : '#888'}
          trackColor={{ false: '#444', true: '#555' }}
        />
      </View>

      {/* 🎨 Theme toggle */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? '#7b2cff' : '#888'}
          trackColor={{ false: '#444', true: '#555' }}
        />
      </View>

      {/* ⚠️ Reset Progress Section */}
      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>DATA MANAGEMENT</Text>
      
      <TouchableOpacity style={styles.dangerButton} onPress={handleResetProgress}>
        <Text style={styles.dangerButtonText}>RESET PROGRESS</Text>
      </TouchableOpacity>

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
    marginBottom: 30,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    marginVertical: 12,
  },
  optionText: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    width: '85%',
    marginVertical: 20,
  },
  sectionHeader: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: '#777',
    marginBottom: 15,
  },
  dangerButton: {
    backgroundColor: '#330000',
    borderWidth: 1,
    borderColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '85%',
    alignItems: 'center',
    marginBottom: 20,
  },
  dangerButtonText: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: '#ff4444',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#222',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  backText: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    color: '#fff',
  },
});