import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TaskWidget from '../components/TasksWidget';
import globalStyles from '../styles/globalStyles';

export default function HomePage() {
  return (
    <View style={styles.container}>
        <Text style={globalStyles.title}>Task-uri</Text>
        <TaskWidget showFooter={true} />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});