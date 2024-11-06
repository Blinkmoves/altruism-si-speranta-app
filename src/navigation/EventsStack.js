import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import EventsPage from '../screens/EventsPage';
import EventShowPage from '../screens/EventShowPage';
import AddEventsPage from '../screens/AddEventsPage';
import EditEventPage from '../screens/EditEventPage';

const Stack = createStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator
      initialRouteName="EventsPage"
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        gestureEnabled: true,
        gestureResponseDistance: 200,
      }}
    >
      <Stack.Screen name="EventsPage" component={EventsPage} />
      <Stack.Screen name="EventShowPage" component={EventShowPage} />
      <Stack.Screen name="AddEventsPage" component={AddEventsPage} />
      <Stack.Screen name="EditEventPage" component={EditEventPage} />
    </Stack.Navigator>
  );
}

export default EventsStack;