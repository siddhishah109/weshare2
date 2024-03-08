import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {  View, Text } from 'react-native';
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen1 from "./screens/LoginScreen1";
import LoginScreen from './screens/LoginScreen';
import HomeScreen from "./screens/HomeScreen";
import CreateAccountScreen from './screens/CreateAccountScreen';
import ProfileScreen from './screens/ProfileScreen';
import Tabs from './navigations/Tabs';
import NotificationScreen from './screens/NotificationScreen';
const Stack = createNativeStackNavigator();
 

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOnboardingCompletion = () => {
    setIsOnboardingCompleted(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
     <Stack.Navigator>
     
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
       
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeTabs"  options={{ headerShown: false }} component={Tabs}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LoginScreen1" component={LoginScreen1} options={{ headerShown: false }}/>
        <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }}/>



     
      </Stack.Navigator>
    </NavigationContainer>
  );
}