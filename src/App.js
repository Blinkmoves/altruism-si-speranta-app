import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, CommonActions, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import LoginStack from './navigation/LoginStack';
import AuthenticatedStack from './navigation/AuthenticatedStack';
import { app, db, auth } from './services/firebaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useThemeContext } from './hooks/useThemeContext';

const Stack = createStackNavigator();

// IDEA/TODO: add light and dark themes

export default function Altruism_si_Speranta() {

  const { theme } = useThemeContext();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // useEffect(() => {
  //   console.log("Theme has changed:", theme);
  // }, [theme]);
  

  // Check if the user is authenticated
  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#093A3E" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            {isAuthenticated ? (
              <Stack.Screen name="AuthenticatedStack" component={AuthenticatedStack} options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="LoginStack" component={LoginStack} options={{ headerShown: false }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
