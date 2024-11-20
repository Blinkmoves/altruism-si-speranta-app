import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import TaskWidget from '../components/TasksWidget';
import EventsWidget from '../components/EventsWidget';
import globalStyles from '../styles/globalStyles';
import useThemeStyles from '../hooks/useThemeStyles';

export default function HomePage() {

  const { themeStyles, colors } = useThemeStyles();

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[globalStyles.title, themeStyles.text, { paddingTop: 10 }]}>WIP</Text>
      {/* TODO: add only the current user's tasks and events - create a new component that gathers these into a list or sth */}
    </View>
  );
}

// Ensure this style stays!
const styles = {
  container: {
    flex: 1,
  },
};