import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import commonStyles from './styles';
import TaskWidget from './Tasks';

export default function TasksPage() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={commonStyles.container}>
      <View>
        <TaskWidget />
      </View>
        <TouchableOpacity style={commonStyles.Button} onPress={() => console.log('Add Task')}>
          <Text style={commonStyles.ButtonText}>Adaugă Task</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}
