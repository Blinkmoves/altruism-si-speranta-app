import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import commonStyles from './styles';
import TaskWidget from './Tasks';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function TasksPage() {

  const navigation = useNavigation();

  // Navigate to the AddTasksPage
  const navigateToAddTasksPage = () => {
    navigation.navigate('AuthenticatedStack', {
      screen: 'Task-uri',
      params: {
        screen: 'AddTasksPage',
      },
    });
  };

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
      <TaskWidget showFooter={false} />
      </MaskedView>
      <View style={styles.addButtonArea}>
        <TouchableOpacity style={commonStyles.Button} onPress={navigateToAddTasksPage}>
          <Text style={commonStyles.ButtonText}>Adaugă Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  maskedView: {
    flex: 1,
    height: '90%',
  },
  gradient: {
    flex: 1,
  },
  addButtonArea: {
    padding: 20,
  },
});