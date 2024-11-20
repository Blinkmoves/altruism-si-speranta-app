import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../styles/globalStyles';
import EventsWidget from '../components/EventsWidget';
import useThemeStyles from '../hooks/useThemeStyles';

// TODO

export default function EventsPage() {

  const { themeStyles, colors } = useThemeStyles();

  return (
    <View style={[globalStyles.container, themeStyles.container]}>
      <EventsWidget />
      <View>
        <TouchableOpacity
          onPress={() => {
            console.log('Event added!');
          }}
          style={[globalStyles.button, themeStyles.button]}
        >
          <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Adaugă Eveniment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
