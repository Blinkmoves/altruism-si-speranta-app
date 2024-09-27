import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from './styles';

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      name: 'Task 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed turpis placerat, convallis leo nec, viverra turpis. Sed molestie felis et lacus malesuada, fermentum vehicula neque lacinia. Ut eu est lacus.',
      deadline: '2024-01-01',
      responsible: 'Person A',
      tag: ['urgent', 'high priority'],
      isChecked: false,
    },
    {
      name: 'Task 2',
      description:
        'Praesent dignissim justo eget pellentesque molestie. Praesent rhoncus, justo nec suscipit mollis, ipsum libero aliquet ante, sed dictum dolor ipsum ut tellus. Nullam vel purus eros.',
      deadline: '2024-02-01',
      responsible: 'Person B',
      tag: ['important', 'urgent'],
      isChecked: false,
    },
    {
      name: 'Task 3',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Person C',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
    {
      name: 'Task 4',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Person C',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
    {
      name: 'Task 5',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Person C',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
    {
      name: 'Task 6',
      description: 'Description 3',
      deadline: '2024-03-01',
      responsible: 'Person C',
      tag: ['casual', 'event X'],
      isChecked: false,
    },
  ]);

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].isChecked = !newTasks[index].isChecked;
    if (newTasks[index].isChecked) {
      newTasks.splice(index, 1); // Remove task if checked
    }
    setTasks(newTasks);
  };

  const renderTask = ({ item, index }) => {
    return (
      <View>
        <View style={styles.row}>
          <CheckBox
            value={item.isChecked}
            onValueChange={() => toggleTask(index)}
          />
          <View style={styles.taskDetails}>
            <Text>{item.description}</Text>
            <View style={styles.chipContainer}>
              {item.tag.map((tag, tagIndex) => (
                <View key={tagIndex} style={styles.chip}>
                  <Text style={styles.chipText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.taskInfoRow}>
              <Text>Deadline: {item.deadline}</Text>
              <Text>Responsabil: {item.responsible}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => deleteTask(index)}>
                <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={commonStyles.Button} onPress={() => console.log('Add Task')}>
        <Text style={commonStyles.ButtonText}>Adaugă Task</Text>
      </TouchableOpacity>
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
    backgroundColor: 'teal',
    padding: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    fontSize: 18,
    color: 'red',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});
