import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import TasksPage from '../screens/TasksPage';
import TaskShowPage from '../screens/TaskShowPage';
import AddTasksPage from '../screens/AddTasksPage';
import EditTaskPage from '../screens/EditTaskPage';

const Stack = createStackNavigator();

function TasksStack() {
  return (
    <Stack.Navigator
      initialRouteName="TasksPage"
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        gestureEnabled: true,
        gestureResponseDistance: 200,
      }}
    >
      <Stack.Screen name="TasksPage" component={TasksPage} />
      <Stack.Screen name="TaskShowPage" component={TaskShowPage} />
      <Stack.Screen name="AddTasksPage" component={AddTasksPage} />
      <Stack.Screen name="EditTaskPage" component={EditTaskPage} />
    </Stack.Navigator>
  );
}

export default TasksStack;