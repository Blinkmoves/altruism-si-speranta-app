import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function Events() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evenimente</Text>
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
            selectedColor: 'teal',
          },
        }}
      />

      {/* Example Button for Adding Events */}
      <TouchableOpacity
        onPress={() => {
          console.log('Add Event Pressed');
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Adaugă Eveniment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
