import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import globalStyles from '../styles/globalStyles';
import EventsWidget from '../components/EventsWidget';

export default function EventsPage() {
  const [selectedDay, setSelectedDay] = useState(Date.now());

  return (
    <View style={globalStyles.container}>
      <EventsWidget />
      <View>
        <TouchableOpacity
          onPress={() => {
            // TODO: Add Accept / Decline event buttons (also make sure answer can be edited after)
            console.log('Event added!');
          }}
          style={globalStyles.Button}
        >
          <Text style={globalStyles.ButtonText}>Adaugă Eveniment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
