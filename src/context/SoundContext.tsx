import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // 1. Load saved setting on app start
  useEffect(() => {
    const loadSoundSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem('SOUND_ENABLED');
        if (saved !== null) {
          setSoundEnabled(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Failed to load sound setting', error);
      } finally {
        setLoaded(true);
      }
    };
    loadSoundSetting();
  }, []);

  // 2. Save setting whenever it changes
  const toggleSound = async () => {
    try {
      const newState = !soundEnabled;
      setSoundEnabled(newState);
      await AsyncStorage.setItem('SOUND_ENABLED', JSON.stringify(newState));
    } catch (error) {
      console.log('Failed to save sound setting', error);
    }
  };

  // Don't render the app until we know the sound setting (prevents the "music flash")
  if (!loaded) {
    return null; 
  }

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};