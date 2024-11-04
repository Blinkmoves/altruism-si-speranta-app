import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native';
import globalStyles from '../styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Toast from 'react-native-toast-message';
import toastConfig from '../utils/toastConfig';
import EventsWidget from './EventsWidget';
import { useNavigation } from '@react-navigation/native';
import { deleteTask, editTask, completeTask } from '../utils/taskActions';
import { SwipeListView } from 'react-native-swipe-list-view';

// IDEA: add filtering based on tags
// IDEA: add animation when TaskWidget renders to show the hidden swipe buttons (like a bounce effect) (you can use react-native-animatable?)
// IDEA: add delete as in Files on iOS (deletion goes up until the left of the screen then the row disappears from the bottom to top)
// Tutorial for this here: https://www.youtube.com/watch?v=k-Ra0tdCEOc

// FIXME: when navigating to the TaskShowPage from the HomePage, the TaskPage can never be reset to top of the stack
// ^ Seems to be working now, but keep an eye on it

export default function TaskWidget({ showFooter }) {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

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

  const handleEditTask = (taskId, uid, updatedTask) => {
    editTask(taskId, uid, updatedTask);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  // console.log(tasks);

  // Check if isChecked is true and skip those tasks
  const filteredTasks = tasks.filter(task => !task.isChecked);

  // Navigate to TaskShowPage
  const navigateToTaskShowPage = (task) => {
    navigation.navigate('AuthenticatedStack', {
      screen: 'Task-uri',
      params: {
        screen: 'TaskShowPage',
        params: { taskId: task.id, uid: task.uid },
      },
    });
  };

  // Define renderItem
  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      onPress={() => navigateToTaskShowPage(item)}
      underlayColor="#f0f0f0"
      activeOpacity={0.6}
    >
      <View style={styles.rowFront}>
        <View style={styles.row}>
          {/* Task Details */}
          <View style={styles.taskDetails}>
            <Text>{item.description}</Text>
            {/* Tags */}
            <View style={styles.chipContainer}>
              {item.tags && item.tags.length > 0 ? (
                item.tags.map((tag, tagIndex) => (
                  <View key={tagIndex} style={styles.chip}>
                    <Text style={styles.chipText}>{tag}</Text>
                  </View>
                ))
              ) : null}
            </View>
            {/* Deadline and Responsible Person */}
            <View style={styles.taskInfoRow}>
              <Text style={styles.taskInfoText}>Deadline:
                <Text style={styles.taskResponsabil}> {formatDate(item.deadline)}</Text>
              </Text>
              <Text style={styles.taskInfoText}>Responsabil:
                <Text style={styles.taskResponsabil}> {item.responsiblePerson}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  // Define renderHiddenItem
  const renderHiddenItem = ({ item, index }) => (
    <View style={styles.rowBack}>
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
      <SwipeListView
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableLeftSwipe={false}
        disableRightSwipe={false}
        ListFooterComponent={showFooter ? (
          <View>
            <Text style={globalStyles.title}>Evenimente</Text>
            <EventsWidget />
          </View>
        ) : null}
      />
      <Toast config={toastConfig} />
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
    backgroundColor: '#60908C',
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
    backgroundColor: '#ddd',
  },
  rowFront: {
    backgroundColor: 'white',
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
