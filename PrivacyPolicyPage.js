import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import commonStyles from './styles';


export default function PrivacyPolicyPage () {
  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
        <View style={styles.section}>
        <Text style={styles.title}>Politica de Confidențialitate</Text>
        </View>
        <View style={styles.section}>
        <Text style={styles.bodyText}>
            Your privacy is important to us. It is our policy to respect your privacy regarding any
            information we may collect from you across our website, app, and other sites we own and operate.
        </Text>
        </View>
        <View style={styles.section}>
        <Text style={styles.subtitle}>1. Information we collect</Text>
        </View>
        <View style={styles.section}>
        <Text style={styles.bodyText}>
            We only collect information about you if we have a reason to do so – for example, to provide
            our services, to communicate with you, or to make our services better.
        </Text>
        </View>
        {/* TODO: Modify content and add more sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 16,
  },
});
