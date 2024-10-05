import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry, Text, View } from 'react-native';
import HomePage from './HomePage';
import TasksPage from './TasksPage';
import EventsPage from './EventsPage';
import SettingsPage from './SettingsPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import Login from './login';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      }}
    >
      <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false, headerTitle: '' }} />
      <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} options={{ headerTitle: ''}}/>
    </Stack.Navigator>
  );
}

export default function Altruism_si_Speranta() {
  return (
    <NavigationContainer>
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
            // TODO: remove this once backend logic is finished
            } else if (route.name === 'Login') {
              iconName = focused ? 'login' : 'login';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#a0a3a3',
          tabBarStyle: { backgroundColor: '#093A3E', paddingTop: 10 },
          headerStyle: { backgroundColor: '#093A3E' }, // Set header background color
          headerTintColor: '#F5F7F7', // Set header text color
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 }, // Set header text style
        })}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Task-uri" component={TasksPage} options={{ tabBarLabel: 'Task-uri' }} />
        <Tab.Screen name="Evenimente" component={EventsPage} options={{ tabBarLabel: 'Evenimente' }} />
        <Tab.Screen name="Setări" component={SettingsStack} options={{ tabBarLabel: 'Setări' }} />
        {/* TODO: remove this once backend logic is finished */}
        <Tab.Screen name="Login" component={Login} options={{ tabBarLabel: 'Login' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Register the main component
AppRegistry.registerComponent('main', () => Altruism_si_Speranta);

// TODO: remove the headertext from all pages
