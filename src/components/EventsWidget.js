import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import globalStyles from '../styles/globalStyles';

export default function EventsWidget() {
  const currentDate = new Date().toISOString().split('T')[0];
  const maxDate = '9999-12-31';
  return (
    <View style={styles.container}>
      <Calendar
        // Set the first and last selectable days
        minDate={currentDate}
        maxDate={maxDate}
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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// TODO: make calendar view / event list view, add functionality
