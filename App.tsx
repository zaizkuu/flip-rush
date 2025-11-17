import React, { useEffect, useState } from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SoundProvider } from './src/context/SoundContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      await Font.loadAsync({
        'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf'),
      });
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; // Wait until fonts are loaded
  }

  return (
    <SoundProvider>
      <AppNavigator />
    </SoundProvider>
  );
}