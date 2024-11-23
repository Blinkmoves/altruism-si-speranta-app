import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import LoginStack from "./navigation/LoginStack";
import AuthenticatedStack from "./navigation/AuthenticatedStack";
import { app, db, auth } from "./services/firebaseConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useThemeContext } from "./hooks/useThemeContext";
import Toast from "react-native-toast-message";
import toastConfig from "./utils/toastConfig";
import { showSuccessToast, showErrorToast } from "./utils/toastHelpers";

const Stack = createStackNavigator();

// BUG splash screen is not working.. it's displaying the icon instead of splash screen (config is in app.json)

export default function Altruism_si_Speranta() {

  // useEffect(() => {
  //   // Prevent the splash screen from auto-hiding
  //   SplashScreen.preventAutoHideAsync();

  //   setTimeout(async () => {
  //     await SplashScreen.hideAsync();
  //   }, 2000);
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { isReloading, theme } = useThemeContext();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const prevAuthState = useRef(null);

  const [appIsReady, setAppIsReady] = useState(false);

  // Prevent auto-hiding the splash screen
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Simulate loading resources
  useEffect(() => {
    async function prepare() {
      try {
        // Load resources here (e.g., fonts, assets)
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Hide the splash screen once the app is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

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
        showSuccessToast("Te-ai logat cu succes!");
      } else if (prevAuthState.current && !isAuthenticated) {
        // User has just logged out
        showSuccessToast("Te-ai delogat cu succes!");
      }
    }
    // Update the prevAuthState to current state
    prevAuthState.current = isAuthenticated;
  }, [isAuthenticated]);
  
  // Check if the user is authenticated
  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication state
    return (
      <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          },
        ]}
        >
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }
  
  if (isReloading) {
    // Display the Activity Indicator
    return (
      <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        },
      ]}
      >
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }
  
  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
      <Toast config={toastConfig} topOffset={60} visibilityTime={3000} />
    </View>
  );
}
