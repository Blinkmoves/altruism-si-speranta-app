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
        <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} options={{ headerShown: false, headerTitle: '' }} />
      </Stack.Navigator>
    );
  }

  // Tasks stack that includes the TasksPage, AddTasksPage, and TaskShowPage
  function TasksStack() {
    return (
      <Stack.Navigator
        initialRouteName="TasksPage"
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
        <Stack.Screen name="TasksPage" component={TasksPage} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="AddTasksPage" component={AddTasksPage} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="TaskShowPage" component={TaskShowPage} options={{ headerShown: false, headerTitle: '' }} />
      </Stack.Navigator>
    );
  }

  // TODO: Add event stack that includes the EventsPage, AddEventPage and EventShowPage

  // Login stack that includes the Login, CreateAccount, and ForgotPassword screens
  function LoginStack() {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#093A3E', // Use the color here for the header background
          },
          headerTintColor: '#fff', // Set the header text color to white
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false, headerTitle: '' }} />
      </Stack.Navigator>
    );
  }

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
          // headerTitle: () => <CustomHeader title={`Fii altruist(ă) și azi, ${displayName}!`} />,
          headerTitle: '',
        })}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ tabBarLabel: 'Home' }}>
        </Tab.Screen>
        <Tab.Screen name="Task-uri" component={TasksStack} options={{ tabBarLabel: 'Task-uri' }}>
        </Tab.Screen>
        <Tab.Screen name="Evenimente" component={EventsPage} options={{ tabBarLabel: 'Evenimente' }} />
        <Tab.Screen name="Setări" component={SettingsStack} options={{ tabBarLabel: 'Setări' }} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <LoginStack setIsAuthenticated={setIsAuthenticated} />}
    </NavigationContainer>
  );
};
