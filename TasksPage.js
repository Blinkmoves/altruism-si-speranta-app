import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import commonStyles from './styles';
import TaskWidget from './Tasks';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function TasksPage() {
  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <LinearGradient
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            locations={[0.95, 1]} // 80% to 100%
            style={styles.gradient}
          />
        }
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TaskWidget />
        </ScrollView>
      </MaskedView>
      <View style={styles.addButtonArea}>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add Task')}>
          <Text style={commonStyles.ButtonText}>Adaugă Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  maskedView: {
    flex: 1,
    height: '90%',
  },
  gradient: {
    flex: 1,
  },
  addButtonArea: {
    alignItems: 'center',
    marginVertical: 8,
    height: '10%',
  },
  addButton: {
    position: 'absolute',
    width: '50%',
    bottom: 0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'teal',
  },
});