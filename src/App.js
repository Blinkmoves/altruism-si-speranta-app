import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import LoginStack from './navigation/LoginStack';
import AuthenticatedStack from './navigation/AuthenticatedStack';
import { app, db, auth } from './services/firebaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useThemeContext } from './hooks/useThemeContext';
import Toast from 'react-native-toast-message';
import toastConfig from './utils/toastConfig';
import { showSuccessToast, showErrorToast } from './utils/toastHelpers';

const Stack = createStackNavigator();

export default function Altruism_si_Speranta() {

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {

  const { theme } = useThemeContext();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const prevAuthState = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Show Toast messages based on auth state
  useEffect(() => {
    // If previous auth state is not null (we have a previous state to compare)
    if (prevAuthState.current !== null) {
      if (!prevAuthState.current && isAuthenticated) {
        // User has just logged in
        showSuccessToast('Te-ai logat cu succes!');
      } else if (prevAuthState.current && !isAuthenticated) {
        // User has just logged out
        showSuccessToast('Te-ai delogat cu succes!');
      }
    }
    // Update the prevAuthState to current state
    prevAuthState.current = isAuthenticated;
  }, [isAuthenticated]);

  // Check if the user is authenticated
  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication state
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          {isAuthenticated ? (
            <Stack.Screen
              name="AuthenticatedStack"
              component={AuthenticatedStack}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="LoginStack"
              component={LoginStack}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast
        config={toastConfig}
        topOffset={60}
        visibilityTime={3000}
      />
    </GestureHandlerRootView>
  );
};
