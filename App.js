import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import commonStyles from './styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// IDEA: add dark mode as well using useColorScheme

export default function Altruism_si_Speranta() {

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const displayName = auth.currentUser?.displayName || '';

  // Define custom header component
  // const CustomHeader = ({ title }) => {
  //   return (
  //     <View style={commonStyles.headerContainer}>
  //       <Image source={require('./assets/logo.png')} style={commonStyles.headerLogo} />
  //       <Text style={commonStyles.headerTitle}>{title}</Text>
  //     </View>
  //   );
  // };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
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
          headerBackTitle: ' Înapoi', // Customize the back button text
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
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="AuthenticatedStack" component={AuthenticatedStack} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="LoginStack" component={LoginStack} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
