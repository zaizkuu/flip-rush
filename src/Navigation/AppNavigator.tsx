import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import MainMenu from '../screens/MainMenu';
import LevelSelect from '../screens/LevelSelect';
import GameScreen from '../screens/GameScreen';

export type RootStackParamList = {
  MainMenu: undefined;
  LevelSelect: undefined;
  GameScreen: { level: number }; // ✅ expects a level param
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="LevelSelect" component={LevelSelect} />
        <Stack.Screen name="GameScreen" component={GameScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}