import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
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
  ]);

  // TODO: add functionality to swipe/pan left to delete task
  // Delete task function
  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  // TODO: add backend connection to delete task in DB

  // TODO: fix toggleTask function

  // Toggle task completion function
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].isChecked = !newTasks[index].isChecked;
    setTasks(newTasks);
  };

  // TODO: add backend connection to update task completion in DB
  
  // TODO: add animations for both of these

  return (
    <View>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View>
            <View style={styles.row}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => toggleTask(index)}
                color={item.isChecked ? 'teal' : 'grey'}
                style={styles.checkboxTask}
              />
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
              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteTask(index)}>
                <MaterialCommunityIcons name="trash-can-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </View>
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
  },
  taskDetails: {
    flex: 1,
    paddingHorizontal: 10,
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
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  checkboxTask: {
    alignSelf: 'top',
    width: 18,
    height: 18,
  },
});
