import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TaskWidget from './Tasks';
import commonStyles from './styles';

export default function HomePage() {
  return (
    <View style={styles.container}>
        <Text style={commonStyles.title}>Task-uri</Text>
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