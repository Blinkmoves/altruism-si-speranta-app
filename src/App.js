import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, CommonActions, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './styles/themes';

import LoginStack from './navigation/LoginStack';
import AuthenticatedStack from './navigation/AuthenticatedStack';

import { app, db, auth } from './services/firebaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createStackNavigator();

// IDEA/TODO: add light and dark themes

export default function Altruism_si_Speranta() {

  const scheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    // FIXME: TODO: Reset the navigation state when pressing the bottom tab button
    // FIXME: see the fixme in the TaskWidget.js file

    return () => {
      unsubscribeAuth();
    };
  }, []);

  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#093A3E" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        theme={scheme === 'dark' ? darkTheme : lightTheme}
      >
        <Stack.Navigator>
          {isAuthenticated ? (
            <Stack.Screen name="AuthenticatedStack" component={AuthenticatedStack} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="LoginStack" component={LoginStack} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
