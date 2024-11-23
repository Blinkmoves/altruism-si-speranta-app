// TODO

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themeStyles } from '../styles/themeStyles';
import useThemeStyles from "../hooks/useThemeStyles";
import { useThemeContext } from '../hooks/useThemeContext';

const EventShowPage = () => {

  const { themeStyles, colors } = useThemeStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.eventText, themeStyles.text]}>Event Show Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    fontSize: 24,
  },
});

export default EventShowPage;