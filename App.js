import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import HomePage from './HomePage';
import TasksPage from './TasksPage';
import EventsPage from './EventsPage';
import SettingsPage from './SettingsPage';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Tasks') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Events') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F5F7F7',
          tabBarInactiveTintColor: '#AAC6A8',
          tabBarStyle: { backgroundColor: '#093A3E', paddingTop: 5 },
        })}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Tasks" component={TasksPage} options={{ tabBarLabel: 'Task-uri' }} />
        <Tab.Screen name="Events" component={EventsPage} options={{ tabBarLabel: 'Evenimente' }} />
        <Tab.Screen name="Settings" component={SettingsPage} options={{ tabBarLabel: 'Setări' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
