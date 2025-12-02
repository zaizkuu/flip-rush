import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all your screens here
import MainMenu from '../screens/MainMenu';
import LevelSelect from '../screens/LevelSelect';
import GameScreen from '../screens/GameScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutUsScreen from '../screens/AboutUs'; // ✅ Importing your new file

// Define the parameters for each screen
export type RootStackParamList = {
  MainMenu: undefined;
  LevelSelect: undefined;
  GameScreen: { level: number; topic?: string }; // Updated for Level & Topic logic
  SettingsScreen: undefined;
  AboutUs: undefined; // ✅ New Route
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainMenu"
        screenOptions={{
          headerShown: false, // Hides top bar for full-screen game feel
          animation: 'fade',  // Smooth fade transitions
        }}
      >
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="LevelSelect" component={LevelSelect} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        
        {/* ✅ Register the About Us Screen */}
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}