import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import HomePage from './HomePage';
import TasksPage from './TasksPage';
import AddTasksPage from './AddTasksPage';
import TaskShowPage from './TaskShowPage';
import EventsPage from './EventsPage';
import SettingsPage from './SettingsPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import Login from './login';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { app, db, auth } from './firebaseConfig';
import globalStyles from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// IDEA: add dark mode as well using useColorScheme

export default function Altruism_si_Speranta() {

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const displayName = auth.currentUser?.displayName || '';
  // const navigationRef = useRef();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    // FIXME: TODO: fix the navigation state reset when pressing a bottom tab button
    // FIXME: see the fixme in the Tasks.js file
    
    // const handleStateChange = (e) => {
    //   const state = e.data.state;
    //   const currentRoute = state.routes[state.index];

    //   navigationRef.current?.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{ name: currentRoute.name }],
    //     })
    //   );
    // };

    // // Only set the listener if the navigation ref is available
    // if (navigationRef.current) {
    //   navigationRef.current.addListener('state', handleStateChange);
    // }

    return () => {
      unsubscribeAuth();
      // Remove the listener if it was added
      // if (navigationRef.current) {
      //   navigationRef.current.removeListener('state', handleStateChange);
      // }
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

  // Settings stack that includes the SettingsPage and PrivacyPolicyPage
  function SettingsStack() {
    return (
      <Stack.Navigator
        initialRouteName="SettingsPage"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#093A3E', // Use the color here for the header background
          },
          headerTintColor: '#fff', // Set the header text color to white
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          gestureEnabled: true,
          gestureResponseDistance: 200
        }}
      >
        <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false, headerTitle: '', unmountOnBlur: true }} />
        <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} options={{ headerShown: false, headerTitle: '' }} />
      </Stack.Navigator>
    );
  }

  // Tasks stack that includes the TasksPage, AddTasksPage, and TaskShowPage
  function TasksStack() {
    return (
      <Stack.Navigator
        initialRouteName="TasksPage"
        screenOptions={
          {
            headerShown: false,
            headerTitle: '',
            gestureEnabled: true,
            gestureResponseDistance: 200
          }
        }
      >
        <Stack.Screen name="TasksPage" component={TasksPage} />
        <Stack.Screen name="TaskShowPage" component={TaskShowPage} />
        <Stack.Screen name="AddTasksPage" component={AddTasksPage} />
      </Stack.Navigator>
    );
  }

  // TODO: Add event stack that includes the EventsPage, AddEventPage and EventShowPage

  // Login stack that includes the Login, CreateAccount, and ForgotPassword screens
  function LoginStack() {
    return (
      <Stack.Navigator
        screenOptions={
          {
            headerShown: false,
            headerTitle: '',
            gestureEnabled: true,
            gestureResponseDistance: 200
          }
        }
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    );
  }

  // Authenticated stack that includes the Home, Tasks, Events, and Settings screens
  function AuthenticatedStack() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Task-uri') {
              iconName = focused ? 'format-list-bulleted-type' : 'format-list-bulleted-type';
            } else if (route.name === 'Evenimente') {
              iconName = focused ? 'calendar-check' : 'calendar-check-outline';
            } else if (route.name === 'Setări') {
              iconName = focused ? 'cog' : 'cog-outline';
            }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#a0a3a3',
          tabBarStyle: { backgroundColor: '#093A3E', paddingTop: 10 },
          headerStyle: { backgroundColor: '#093A3E' }, // Set header background color
          headerTitle: '',
          gestureEnabled: true,
          gestureResponseDistance: 200
        })}
      >
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Task-uri" component={TasksStack} />
        <Tab.Screen name="Evenimente" component={EventsPage} />
        <Tab.Screen name="Setări" component={SettingsStack} />
      </Tab.Navigator>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        // ref={navigationRef}
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
