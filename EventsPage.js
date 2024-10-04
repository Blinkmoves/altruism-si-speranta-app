import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import commonStyles from './styles';

// TODO: Import EventWidget from './Events' and use it to display events (get rid of redundant code)

export default function EventsPage() {
  const [selectedDay, setSelectedDay] = useState(Date.now());

  return (
    <View style={commonStyles.container}>
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
      <View>
        <TouchableOpacity
          onPress={() => {
            // TODO: Add Accept / Decline event buttons (also make sure answer can be edited after)
            console.log('Event added!');
          }}
          style={commonStyles.Button}
        >
          <Text style={commonStyles.ButtonText}>Adaugă Eveniment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
