import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomePage from '../screens/HomePage';
import TasksStack from './TasksStack';
import EventsStack from './EventsStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

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
        headerStyle: { backgroundColor: '#093A3E' },
        headerTitle: '',
        gestureEnabled: true,
        gestureResponseDistance: 200,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Task-uri" component={TasksStack} />
      <Tab.Screen name="Evenimente" component={EventsStack} />
      <Tab.Screen name="Setări" component={SettingsStack} />
    </Tab.Navigator>
  );
}

export default AuthenticatedStack;