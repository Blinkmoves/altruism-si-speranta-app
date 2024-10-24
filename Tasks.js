import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from './firebaseConfig';
import { ref, onValue, remove, update } from 'firebase/database';
import Toast from 'react-native-toast-message';
import toastConfig from './toastConfig';
import EventsWidget from './Events';
import { useNavigation } from '@react-navigation/native';

// IDEA: add filtering based on tags

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

  const swipeableRefs = useRef([]);


  // Complete task function
  const completeTask = async (taskId, uid) => {
    try {
      const taskRef = ref(db, `tasks/${uid}/${taskId}`);
      console.log('Updating task:', taskId, 'for user:', uid);
      await update(taskRef, { isChecked: true });
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, isChecked: true } : task
      ));
      Toast.show({
        type: 'success',
        text1: 'Task-ul a fost completat cu succes!',
        visibilityTime: 2000, // 2 seconds
        topOffset: 0,
      });
    } catch (error) {
      console.error('Error completing task: ', error);
      Toast.show({
        type: 'error',
        text1: 'Eroare la completarea task-ului!',
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
    }
  };


  // Delete task function
  const deleteTask = async (taskId, uid) => {
    try {
      const taskRef = ref(db, `tasks/${uid}/${taskId}`);
      await remove(taskRef);
      setTasks(tasks.filter(task => task.id !== taskId));
      Toast.show({
        type: 'success',
        text1: 'Task-ul a fost șters cu succes!',
        visibilityTime: 2000, // 2 seconds
        topOffset: 20,
      });
    } catch (error) {
      console.error('Error deleting task: ', error);
      Toast.show({
        type: 'error',
        text1: 'Eroare la ștergerea task-ului!',
        visibilityTime: 5000, // 5 seconds
        // TODO see why there is too much offset even if 0
        topOffset: 0,
      });
    }
  };

  // Swipe right to complete task
  const renderLeftActions = (progress, drag, index) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 50 }],
        inputRange: [0, 100],
        outputRange: [1, 0],
        progress: progress.value,
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <TouchableOpacity
          onPress={() => {
            // Close the swipeable
            if (swipeableRefs.current[index]) {
              swipeableRefs.current[index].close();
            }
            completeTask(filteredTasks[index].id, filteredTasks[index].uid);
          }}
          style={styles.leftAction}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

  // Swipe left to delete task
  const renderRightActions = (progress, drag, index) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 50 }],
        inputRange: [-100, 0],
        outputRange: [1, 0],
        progress: progress.value,
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <TouchableOpacity
          onPress={() => {
            // Close the swipeable
            if (swipeableRefs.current[index]) {
              swipeableRefs.current[index].close();
            }
            deleteTask(filteredTasks[index].id, filteredTasks[index].uid);
          }}
          style={styles.rightAction}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
        </TouchableOpacity>
      </Reanimated.View>
    );
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
        params: { task },
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <GestureHandlerRootView>
            <ReanimatedSwipeable
              ref={(ref) => (swipeableRefs.current[index] = ref)}
              friction={3}
              enableTrackpadTwoFingerGesture
              overshootLeft={false}
              overshootRight={false}
              renderRightActions={(progress, drag) => renderRightActions(progress, drag, index)}
              renderLeftActions={(progress, drag) => renderLeftActions(progress, drag, index)}
              onSwipeableWillOpen={() => {
                // Close other swipeables
                swipeableRefs.current.forEach((ref, i) => {
                  if (i !== index && ref) {
                    ref.close();
                  }
                });
              }}
            >
              <TouchableOpacity onPress={() => navigateToTaskShowPage(item)}>
                <View>
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
              </TouchableOpacity>
            </ReanimatedSwipeable>
            <View style={styles.divider} />
          </GestureHandlerRootView>
        )}
        ListFooterComponent={showFooter ? (
          <View>
            <Text style={commonStyles.title}>Evenimente</Text>
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
  divider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ccc',
  },
  checkboxTask: {
    alignSelf: 'top',
    width: 18,
    height: 18,
  },
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
    backgroundColor: 'red'
  },
  leftAction: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
    backgroundColor: 'green'
  },
});
