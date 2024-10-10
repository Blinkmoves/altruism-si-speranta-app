import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TaskWidget() {
  const [tasks, setTasks] = useState([
    {
      name: 'Task 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed turpis placerat, convallis leo nec, viverra turpis.',
      deadline: '2024-01-01',
      responsible: 'Paula Redes',
      tag: ['urgent', 'high priority'],
      isChecked: false,
    },
    {
      name: 'Task 2',
      description:
        'Praesent dignissim justo eget pellentesque molestie. Praesent rhoncus, justo nec suscipit mollis.',
      deadline: '2024-02-01',
      responsible: 'Paula Clem',
      tag: ['important', 'urgent'],
      isChecked: false,
    },
    {
      name: 'Task 3',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Paula Negrutiu',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
    {
      name: 'Task 4',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Paula Nadaban',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
    {
      name: 'Task 5',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Paula Rebeca',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
    {
      name: 'Task 6',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Paula Rebeca',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
  ]);

  const swipeableRefs = useRef([]);

  // Delete task function
  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };
  // TODO: add backend connection to delete task in DB

  // Toggle task completion function
  const completeTask = (index) => {
    // console.log(`Toggling task at index: ${index}`);
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      if (newTasks[index]) {
        newTasks.splice(index, 1); // Remove the task from the list
        // newTasks[index].isChecked = !newTasks[index].isChecked;
        // console.log(`Task ${index} isChecked: ${newTasks[index].isChecked}`);
      }
      return newTasks;
    });
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
            completeTask(index);
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
            deleteTask(index);
          }}
          style={styles.rightAction}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  // TODO: add backend connection to update task completion in DB


  return (
    <View>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          // console.log(`Rendering task at index: ${index}, isChecked: ${item.isChecked}`),
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
              <View>
                <View style={styles.row}>
                  {/* Task Details */}
                  <View style={styles.taskDetails}>
                    <Text>{item.description}</Text>
                    {/* Tags */}
                    <View style={styles.chipContainer}>
                      {item.tag.map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.chip}>
                          <Text style={styles.chipText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                    {/* Deadline and Responsible Person */}
                    <View style={styles.taskInfoRow}>
                      <Text style={styles.taskInfoText}>Deadline: {item.deadline}</Text>
                      <Text style={styles.taskInfoText}>Responsabil:
                        <Text style={styles.taskResponsabil}> {item.responsible}</Text></Text>
                    </View>
                  </View>
                </View>
              </View>
            </ReanimatedSwipeable>
            <View style={styles.divider} />
          </GestureHandlerRootView>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
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
  },
  taskInfoText: {
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
