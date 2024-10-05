import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import commonStyles from './styles';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsPage( {navigation} ) {
  const [isEditingPersonalData, setIsEditingPersonalData] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const buttonTextStyle = commonStyles.ButtonText;
  const fontSize = buttonTextStyle.fontSize || 16; // Default to 16 if fontSize is not defined

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.upperContainer}>
        <Text style={commonStyles.title}>Editează Profilul</Text>
        <TouchableOpacity
          style={commonStyles.Button}
          onPress={() => setIsEditingPersonalData(!isEditingPersonalData)}
        >
          <Text style={commonStyles.ButtonText}>Modifică Datele Personale</Text>
        </TouchableOpacity>

        {isEditingPersonalData && (
          <View style={styles.innerContainer}>
            <Text style={styles.label}>Nume</Text>
            <TextInput
              style={styles.input}
              // Add onChangeText and value props to handle the username input
            />
            
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              // Add onChangeText and value props to handle the email input
            />
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                // Add a function to handle the save button press
              }}
            >
              <Text style={commonStyles.ButtonText}>Salvează</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={commonStyles.Button}
          onPress={() => setIsChangingPassword(!isChangingPassword)}
        >
          <Text style={commonStyles.ButtonText}>Schimbă Parola</Text>
        </TouchableOpacity>

        {isChangingPassword && (
          <View style={styles.innerContainer}>
            <Text style={styles.label}>Parolă Curentă</Text>
            <TextInput
              style={styles.input}
              placeholder="Parolă Curentă"
              secureTextEntry
              // TODO: Add onChangeText and value props to handle the current password input
            />
            
            <Text style={styles.label}>Parolă Nouă</Text>
            <TextInput
              style={styles.input}
              placeholder="Parolă Nouă"
              secureTextEntry
              // TODO: Add onChangeText and value props to handle the new password input
            />
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                // TODO: Add a function to handle the save button press
              }}
            >
              <Text style={commonStyles.ButtonText}>Salvează</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* NOTIFICATIONS SETTINGS */}
      {/* TODO add functionality */}
      <View style={styles.notificationContainer}>
        <Text style={commonStyles.title}>Notificări</Text>
        
        <View style={styles.notificationItem}>
          <Text style={styles.label}>Notificări de tip Push</Text>
          <Switch
            value={isPushNotificationsEnabled}
            onValueChange={(value) => setPushNotificationsEnabled(value)}
            trackColor={{ false: '#767577', true: 'teal' }}
            thumbColor={isPushNotificationsEnabled ? 'white' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <Text style={styles.label}>Notificări Email</Text>
          <Switch
            value={isEmailNotificationsEnabled}
            onValueChange={(value) => setEmailNotificationsEnabled(value)}
            trackColor={{ false: '#767577', true: 'teal' }}
            thumbColor={isPushNotificationsEnabled ? 'white' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* PRIVACY POLICY */}
      <TouchableOpacity style={styles.privacyButton} onPress={() => navigation.navigate('PrivacyPolicyPage')}>
        <Text style={commonStyles.ButtonText}>Politica de Confidențialitate</Text>
      </TouchableOpacity>

      {/* Delete and logout buttons */}
      <View>
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="trash" size={fontSize} color={'white'}/>
          <Text style={buttonTextStyle}> Șterge Contul</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={fontSize} color={'white'}/>
          <Text style={commonStyles.ButtonText}> Deconectează-te</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#093A3E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E71D36',
    padding: 16,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#093A3E',
    padding: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  privacyButton: {
    backgroundColor: '#513B5C',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  innerContainer: {
    margin: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  notificationContainer: {
    padding: 20,
    backgroundColor: '#CEC2D2',
    borderRadius: 10,
    marginTop: 20,
  },
  upperContainer: {
    padding: 20,
    backgroundColor: '#F5F7F7',
    borderRadius: 10,
  },
});