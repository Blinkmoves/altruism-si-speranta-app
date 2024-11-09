import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomePage from '../screens/HomePage';
import TasksStack from './TasksStack';
import EventsStack from './EventsStack';
import SettingsStack from './SettingsStack';
import useThemeStyles from '../hooks/useThemeStyles';

const Tab = createBottomTabNavigator();

function AuthenticatedStack() {

  const { themeStyles, colors } = useThemeStyles();

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
        tabBarActiveTintColor: colors.tabBarActiveTint,
        tabBarInactiveTintColor: colors.tabBarInactiveTint,
        tabBarStyle: { backgroundColor: colors.tabBarBackground, paddingTop: 10 },
        headerStyle: { backgroundColor: colors.tabBarBackground },
        headerTitle: '',
        gestureEnabled: true,
        gestureResponseDistance: 200,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      {/* lazy: false to mount the screens on launch to prevent this error: when navigating to the TaskShowPage from the HomePage, the TaskPage can never be reset to top of the stack */}
      <Tab.Screen name="Task-uri" component={TasksStack} options={{ lazy: false }} />
      <Tab.Screen name="Evenimente" component={EventsStack} options={{ lazy: false }} />
      <Tab.Screen name="Setări" component={SettingsStack} />
    </Tab.Navigator>
  );
}

export default AuthenticatedStack;