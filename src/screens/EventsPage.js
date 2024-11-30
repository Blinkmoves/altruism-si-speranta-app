import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../styles/globalStyles';
import EventsWidget from '../components/EventsWidget';
import useThemeStyles from '../hooks/useThemeStyles';
import { useNavigation } from '@react-navigation/native';

export default function EventsPage() {

  const navigation = useNavigation();

  // Navigate to the AddEventsPage
  const navigateToAddEventsPage = () => {
    navigation.navigate('AuthenticatedStack', {
      screen: 'Evenimente',
      params: {
        screen: 'AddEventsPage',
      },
    });
  };

  const { themeStyles, colors } = useThemeStyles();

  return (
    <View style={[globalStyles.container, themeStyles.container]}>
      <EventsWidget />
      <View>
        <TouchableOpacity
          onPress={() => navigateToAddEventsPage()}
          style={[globalStyles.button, themeStyles.button]}
        >
          <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Adaugă Eveniment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
