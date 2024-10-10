import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import TaskWidget from './Tasks';
import EventsWidget from './Events';
import commonStyles from './styles';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View>
            <Text style={commonStyles.title}>Task-uri</Text>
          </View>
          <View>
            <TaskWidget />
          </View>
        </View>
        <View style={commonStyles.container}>
          <View>
            <Text style={commonStyles.title}>Evenimente</Text>
          </View>
          <View>
            <EventsWidget />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});