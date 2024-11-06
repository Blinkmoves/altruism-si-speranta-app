import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/LoginPage';
import CreateAccount from '../screens/CreateAccountPage';
import ForgotPassword from '../screens/ForgotPasswordPage';

const Stack = createStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        gestureEnabled: true,
        gestureResponseDistance: 200,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

export default LoginStack;