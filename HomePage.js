import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import TaskWidget from './Tasks';
import Events from './Events';
import commonStyles from './styles';

export default function HomePage() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}>
        <View>
          <Text style={commonStyles.title}>Task-uri</Text>
        </View>
        <View>
          <TaskWidget />
        </View>
      </View>
      <View style={commonStyles.container}>
        <View>
          <Text style={commonStyles.title}>Evenimente</Text>
        </View>
        <View>
          <Events />
        </View>
      </View>
    </ScrollView>
  );
}
