import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsPage from '../screens/SettingsPage';
import PrivacyPolicyPage from '../screens/PrivacyPolicyPage';

const Stack = createStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        gestureEnabled: true,
        gestureResponseDistance: 200,
      }}
    >
      <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ unmountOnBlur: true }} />
      <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} />
    </Stack.Navigator>
  );
}

export default SettingsStack;