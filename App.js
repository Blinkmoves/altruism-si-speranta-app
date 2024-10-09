import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry, Text, View, Image } from 'react-native';
import HomePage from './HomePage';
import TasksPage from './TasksPage';
import EventsPage from './EventsPage';
import SettingsPage from './SettingsPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import Login from './login';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { app, db } from './firebaseConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// TODO: make this work with firebase
// TODO: define the tasks schema in db

// Use firebase for state management
export default function Altruism_si_Speranta() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await db.ref('tasks').once('value');
      const tasksData = snapshot.val();
      const tasksArray = tasksData ? Object.keys(tasksData).map(key => ({ id: key, ...tasksData[key] })) : [];
      setTasks(tasksArray);
    };

    fetchTasks();
  }, []);

  const completeTask = async (taskId) => {
    await db.ref(`tasks/${taskId}`).remove();
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteTask = async (taskId) => {
    await db.ref(`tasks/${taskId}`).remove();
    setTasks(tasks.filter(task => task.id !== taskId));
  };

// TODO: do sth with the logo

const LogoImage = () => {
  return (
    <View style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      shadowColor: '#fff', // Set the shadow color here
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 1,
      elevation: 5, // For Android shadow
    }}>
      <Image
        style={{ width: 50, height: 40 }}
        source={require('./assets/logo.png')}
      />
    </View>
  );
};

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

            // You can return any icon component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#a0a3a3',
          tabBarStyle: { backgroundColor: '#093A3E', paddingTop: 10 },
          headerStyle: { backgroundColor: '#093A3E' }, // Set header background color
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <LogoImage />
            </View>
          ),
        })}
      >
        <Tab.Screen name="Home" options={{ tabBarLabel: 'Home' }}>
          {props => <HomePage {...props} tasks={tasks} completeTask={completeTask} deleteTask={deleteTask} />}
        </Tab.Screen>
        <Tab.Screen name="Task-uri" options={{ tabBarLabel: 'Task-uri' }}>
          {props => <TasksPage {...props} tasks={tasks} completeTask={completeTask} deleteTask={deleteTask} />}
        </Tab.Screen>
        <Tab.Screen name="Evenimente" component={EventsPage} options={{ tabBarLabel: 'Evenimente' }} />
        <Tab.Screen name="Setări" component={SettingsStack} options={{ tabBarLabel: 'Setări' }} />
        {/* TODO: remove this once backend logic is finished */}
        <Tab.Screen name="Login" component={Login} options={{ tabBarLabel: 'Login' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// // The entry point of the app
// AppRegistry.runApplication('main', {
//   initialProps: {},
//   rootTag: document.getElementById('app-root'),
// });
