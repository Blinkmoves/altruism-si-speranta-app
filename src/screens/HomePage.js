import React from 'react';
import { View, Text } from 'react-native';
import TaskWidget from '../components/TasksWidget';
import globalStyles from '../styles/globalStyles';
import useThemeStyles from '../hooks/useThemeStyles';

export default function HomePage() {

  const { themeStyles, colors } = useThemeStyles();

  return (
    <View style={[styles.container, themeStyles.container]}>
        <Text style={[globalStyles.title, themeStyles.text, { paddingTop: 10 }]}>Task-uri</Text>
        <TaskWidget showFooter={true} />
    </View>
  );
}

// Ensure this style stays!
const styles = {
  container: {
    flex: 1,
  },
};