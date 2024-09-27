import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

export default function TaskWidget() {
  const [tasks, setTasks] = useState([
    {
      name: 'Task 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed turpis placerat, convallis leo nec, viverra turpis.',
      deadline: '2024-01-01',
      responsible: 'Person A',
      tag: ['urgent', 'high priority'],
      isChecked: false,
    },
    {
      name: 'Task 2',
      description:
        'Praesent dignissim justo eget pellentesque molestie. Praesent rhoncus, justo nec suscipit mollis.',
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
  ]);

  // Delete task function
  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  // Toggle task completion function
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].isChecked = !newTasks[index].isChecked;
    setTasks(newTasks);
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Agenda (Task-uri)</Text>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View>
            <View style={styles.row}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => toggleTask(index)}
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
                  <Text>Deadline: {item.deadline}</Text>
                  <Text>Responsabil: {item.responsible}</Text>
                </View>
              </View>
              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteTask(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
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
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});
