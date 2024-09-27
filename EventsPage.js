import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function EventsPage() {
  const [selectedDay, setSelectedDay] = useState(Date.now());

  return (
    <View style={styles.container}>
      <Calendar
        // Set the minimum and maximum selectable dates
        minDate={'2020-01-01'}
        maxDate={'2030-12-31'}
        onDayPress={(day) => {
          console.log('selected day', day);
          setSelectedDay(day.dateString);  // Update the selected day
        }}
        markedDates={{
          [selectedDay]: { selected: true, selectedColor: 'teal' },
        }}
      />
      <View style={styles.padding}>
        <TouchableOpacity
          onPress={() => {
            // TODO: Add your onPress function here
            console.log('Event added!');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Adaugă Eveniment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  padding: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
