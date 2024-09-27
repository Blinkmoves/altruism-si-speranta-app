import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TaskWidget from './Tasks';
import Events from './Events';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.padding}>
          <TaskWidget />
        </View>
        <View style={styles.padding}>
          <Events />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
});
