import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry, Text, View, Image, ActivityIndicator } from 'react-native';
import HomePage from './HomePage';
import TasksPage from './TasksPage';
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

// TODO: add dark mode as well using useColorScheme

// Use firebase for state management
export default function Altruism_si_Speranta() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [tasks, setTasks] = useState([]);

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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // TODO: define the tasks schema in db
  // TODO see how to solve this and the tasks states
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const snapshot = await ref(db, 'tasks').once('value');
  //     const tasksData = snapshot.val();
  //     const tasksArray = tasksData ? Object.keys(tasksData).map(key => ({ id: key, ...tasksData[key] })) : [];
  //     setTasks(tasksArray);
  //   };

  //   fetchTasks();
  // }, []);

  const completeTask = async (taskId) => {
    await ref(db, `tasks/${taskId}`).remove();
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteTask = async (taskId) => {
    await ref(db, `tasks/${taskId}`).remove();
    setTasks(tasks.filter(task => task.id !== taskId));
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
          headerBackTitle: ' Înapoi', // Customize the back button text
        }}
      >
        <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} options={{ headerShown: false, headerTitle: '' }} />
      </Stack.Navigator>
    );
  }

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
            //  else if (route.name === 'Login') {
            //   iconName = focused ? 'login' : 'login';
            // }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#a0a3a3',
          tabBarStyle: { backgroundColor: '#093A3E', paddingTop: 10 },
          headerStyle: { backgroundColor: '#093A3E' }, // Set header background color
          headerTitle: ''
        })}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ tabBarLabel: 'Home' }}>
          {props => <HomePage {...props} tasks={tasks} completeTask={completeTask} deleteTask={deleteTask} />}
        </Tab.Screen>
        <Tab.Screen name="Task-uri" component={TasksPage} options={{ tabBarLabel: 'Task-uri' }}>
          {props => <TasksPage {...props} tasks={tasks} completeTask={completeTask} deleteTask={deleteTask} />}
        </Tab.Screen>
        <Tab.Screen name="Evenimente" component={EventsPage} options={{ tabBarLabel: 'Evenimente' }} />
        <Tab.Screen name="Setări" component={SettingsStack} options={{ tabBarLabel: 'Setări' }} />
        {/* <Tab.Screen name="Login" component={LoginStack} options={{ tabBarLabel: 'Login' }} />  */}
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <LoginStack />}
    </NavigationContainer>
  );
};

// // The entry point of the app
// AppRegistry.runApplication('main', {
//   initialProps: {},
//   rootTag: document.getElementById('app-root'),
// });
