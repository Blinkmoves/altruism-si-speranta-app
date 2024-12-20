import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import globalStyles from '../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Toast from 'react-native-toast-message';
import EventsWidget from './EventsWidget';
import { useNavigation } from '@react-navigation/native';
import { deleteTask, editTask, completeTask } from '../utils/taskActions';
import { SwipeListView } from 'react-native-swipe-list-view';
import useThemeStyles from '../hooks/useThemeStyles';

// IDEA: add filtering based on tags
// IDEA: add animation when TaskWidget renders to show the hidden swipe buttons (like a bounce effect) (you can use react-native-animatable?)
// IDEA: add delete as in Files on iOS (deletion goes up until the left of the screen then the row disappears from the bottom to top)
// IDEA: Tutorial for this here: https://www.youtube.com/watch?v=k-Ra0tdCEOc

// TODO add isDeleted to tasks and hide them from the list don't delete them from the database

// TODO admins can see all tasks, volunteers can see only their tasks

// IDEA: on HomePage, show only a few tasks and a button to see more tasks that navigates the user to the TasksPage

// TODO hide swipe when focus changes

export default function TaskWidget({ showFooter }) {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const { themeStyles, colors } = useThemeStyles();

  useEffect(() => {
    const tasksRef = ref(db, 'tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      // console.log("Data: ", data);
      if (data) {
        const tasksArray = Object.keys(data).flatMap(uid =>
          Object.keys(data[uid]).map(taskId => ({
            id: taskId,
            uid: uid,
            ...data[uid][taskId],
          }))
        );
        // console.log('Fetched tasks:', tasksArray); // This should give you a flat array of tasks
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // Handle task actions
  const handleCompleteTask = (taskId, uid) => {
    completeTask(taskId, uid, setTasks, tasks);
  };

  const handleDeleteTask = (taskId, uid) => {
    deleteTask(taskId, uid, setTasks);
  };

  const handleEditTask = (taskId, uid) => {
    editTask(taskId, uid, navigation);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  // console.log(tasks);

  // Check if isCompleted is true and skip those tasks
  const filteredTasks = tasks.filter(task => !task.isCompleted);

  // Navigate to TaskShowPage
  const navigateToTaskShowPage = (task) => {
    navigation.navigate('Task-uri', {
        screen: 'TaskShowPage',
        params: { taskId: task.id, uid: task.uid },
    });
  };

  // Define renderItem
  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      onPress={() => navigateToTaskShowPage(item)}
      underlayColor="#f0f0f0"
      activeOpacity={0.6}
    >
      <View style={[styles.rowFront, themeStyles.container]}>
        <View style={styles.row}>
          {/* Task Details */}
          <View style={styles.taskDetails}>
            <Text style={themeStyles.text}>{item.description}</Text>
            {/* Tags */}
            <View style={styles.chipContainer}>
              {item.tags && item.tags.length > 0 ? (
                item.tags.map((tag, tagIndex) => (
                  <View key={tagIndex} style={[styles.chip, themeStyles.chip]}>
                    <Text style={[styles.chipText, themeStyles.chip]}>{tag}</Text>
                  </View>
                ))
              ) : null}
            </View>
            {/* Deadline and Responsible Person */}
            <View style={styles.taskInfoRow}>
              <Text style={[styles.taskInfoText, themeStyles.textGray]}>Deadline:
                <Text style={[styles.taskResponsabil, themeStyles.text]}> {formatDate(item.deadline)}</Text>
              </Text>
              <Text style={[styles.taskInfoText, themeStyles.textGray]}>Responsabil:
                <Text style={[styles.taskResponsabil, themeStyles.text]}> {item.responsiblePerson}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  // Define renderHiddenItem
  const renderHiddenItem = ({ item, index }) => (
    <View style={[styles.rowBack, themeStyles.rowBack]}>
      {/* Left Side: Complete Button */}
      <TouchableOpacity
        style={[styles.backLeftBtn, styles.completeButton]}
        onPress={() => handleCompleteTask(item.id, item.uid)}
      >
        <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={26} color="white" />
      </TouchableOpacity>

      {/* Right Side: Edit and Delete Buttons */}
      <View style={styles.rightButtons}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.editButton]}
          onPress={() => handleEditTask(item.id, item.uid)}
        >
          <MaterialCommunityIcons name="square-edit-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.deleteButton]}
          onPress={() => handleDeleteTask(item.id, item.uid)}
        >
          <MaterialCommunityIcons name="trash-can" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="teal" />
        </View>
      ) : (
        <SwipeListView
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableLeftSwipe={false}
          disableRightSwipe={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  taskDetails: {
    flex: 1,
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  chip: {
    // backgroundColor: '#976E9E', // change back to #60908C if you want green (Also in TaskShowPage.js)
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 4,
    marginTop: 4,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  taskResponsabil: {
    color: 'black',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taskInfoText: {
    flex: 1,
    fontSize: 12,
    color: 'grey',
    fontWeight: 'bold',
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#ddd',
  },
  rowFront: {
    // backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backLeftBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 75,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '100%',
  },
  completeButton: {
    backgroundColor: 'green',
  },
  editButton: {
    backgroundColor: 'teal',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});
