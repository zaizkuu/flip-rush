import React from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // ✅ No NavigationContainer here — AppNavigator already has it
  return <AppNavigator />;
}
