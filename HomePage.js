import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TaskWidget from './Tasks';
import Events from './Events';
import commonStyles from './styles';

export default function HomePage() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}>
        <View style={styles.padding}>
          <TaskWidget />
        </View>
        <View style={styles.eventsTitleHomePage}>
          <Events />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eventsTitleHomePage: {
    marginTop: 20,
  }
});
