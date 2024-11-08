import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
import TaskWidget from '../components/TasksWidget';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import useThemeStyles from '../hooks/useThemeStyles';

export default function TasksPage() {

  const { themeStyles, colors } = useThemeStyles();

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
    <View style={[styles.container, themeStyles.container]}>
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
        <TouchableOpacity style={[globalStyles.button, , themeStyles.button]} onPress={navigateToAddTasksPage}>
          <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Adaugă Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
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