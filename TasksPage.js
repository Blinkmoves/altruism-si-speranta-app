import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import commonStyles from './styles';
import TaskWidget from './Tasks';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function TasksPage() {
  return (
    <View style={commonStyles.container}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <LinearGradient
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            locations={[0.8, 0.9]} // 80% to 100%
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
  maskedView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  addButtonArea: {
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'teal',
  },
});