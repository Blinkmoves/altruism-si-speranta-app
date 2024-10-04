import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import commonStyles from './styles';

export default function Events() {
  return (
    <View style={styles.container}>
      <Calendar
        // Set the first and last selectable days
        minDate={'2020-01-01'}
        maxDate={'2030-12-31'}
        onDayPress={(day) => {
          console.log('selected day', day);
        }}
        markedDates={{
          [new Date().toISOString().split('T')[0]]: {
            selected: true,
            selectedColor: '#60908C',
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// TODO: make calendar view / event list view, add functionality
