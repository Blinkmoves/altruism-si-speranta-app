import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from './styles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from './errorMessages'; // Import the error handling function
import toastConfig from './toastConfig'; // Import custom toast configuration

export default function SettingsPage() {

  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [isEditingPersonalData, setIsEditingPersonalData] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const buttonTextStyle = commonStyles.ButtonText;
  const fontSize = buttonTextStyle.fontSize || 16; // Default to 16 if fontSize is not defined

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      Toast.show({
        type: 'success',
        text1: 'Te-ai delogat cu succes!',
        visibilityTime: 2000, // 2 seconds
        topOffset: 20,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
      Toast.show({
        type: 'error',
        text1: friendlyErrorMessage,
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
    }
  };


  // DELETE ACCOUNT LOGIC START

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Nu există niciun utilizator autentificat.',
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
      return;
    }

    // Prompt the user to confirm account deletion
    Alert.alert(
      'Confirmare Ștergere Cont',
      'Ești sigur că vrei să ștergi contul? Această acțiune este ireversibilă.',
      [
        {
          text: 'Anulează',
          style: 'cancel',
        },
        {
          text: 'Șterge',
          style: 'destructive',
          onPress: () => showPasswordPrompt(),
        },
      ],
      { cancelable: false }
    );
  };

  const showPasswordPrompt = () => {
    // Show the password input alert
    Alert.prompt(
      'Confirmare Parolă',
      'Introdu parola pentru a confirma ștergerea contului.',
      [
        {
          text: 'Anulează',
          style: 'cancel',
        },
        {
          text: 'Șterge',
          style: 'destructive',
          onPress: (password) => confirmDeleteAccount(password),
        },
      ],
      'secure-text'
    );
  };

  const confirmDeleteAccount = async (password) => {
    const user = auth.currentUser;
    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete the user
      await deleteUser(user);
      Toast.show({
        type: 'success',
        text1: 'Contul a fost șters cu succes!',
        visibilityTime: 3000, // 2 seconds
        topOffset: 60,
      });
      navigation.navigate('Login'); // Navigate to the login screen after account deletion
    } catch (error) {
      const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
      Toast.show({
        type: 'error',
        text1: friendlyErrorMessage,
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
    }
  };

  // DELETE ACCOUNT LOGIC END


  return (
    <View style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View>
          <Text style={commonStyles.title}>Editează Profilul</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsEditingPersonalData(!isEditingPersonalData)}
          >
            <Text style={commonStyles.ButtonText}>Modifică Datele Personale</Text>
          </TouchableOpacity>

          {isEditingPersonalData && (
            <View style={styles.innerContainer}>
              <Text style={styles.label}>Nume</Text>
              <TextInput
                style={styles.input}
              // TODO Add onChangeText and value props to handle the username input
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
              // TODO Add onChangeText and value props to handle the email input
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  // TODO Add a function to handle the save button press
                }}
              >
                <Text style={commonStyles.ButtonText}>Salvează</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.editProfileButton}
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
        <View elevation={5} clipToPadding={false} style={styles.notificationContainer}>
          <Text style={styles.notificationsTitle}>Notificări</Text>

          <View style={styles.notificationItem}>
            <Text style={styles.notificationsLabel}>Notificări de tip Push</Text>
            <Switch
              value={isPushNotificationsEnabled}
              onValueChange={(value) => setPushNotificationsEnabled(value)}
              trackColor={{ false: 'transparent', true: '#4D3D5B' }}
              thumbColor={isPushNotificationsEnabled ? 'white' : '#f4f3f4'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.notificationItem}>
            <Text style={styles.notificationsLabel}>Notificări Email</Text>
            <Switch
              value={isEmailNotificationsEnabled}
              onValueChange={(value) => setEmailNotificationsEnabled(value)}
              trackColor={{ false: 'transparent', true: '#4D3D5B' }}
              thumbColor={isEmailNotificationsEnabled ? 'white' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* BOTTOM BUTTONS SECTION */}
        <View style={[styles.notificationContainer, { paddingVertical: 20 }]}>
          
          {/* PRIVACY POLICY */}
          <TouchableOpacity style={styles.bottomButtons} onPress={() => navigation.navigate('PrivacyPolicyPage')}>
            <View style={styles.iconTextArea}>
              <View style={{ width: '10%' }} >
                <MaterialCommunityIcons name="file-lock-outline" size={26} color={'#976E9E'} />
              </View>
              <View style={{ width: '90%' }} >
                <Text style={styles.bottomButtonText}> Politica de Confidențialitate</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.bottomDivider} />

          {/* DELETE BUTTON */}
          <TouchableOpacity style={styles.bottomButtons} onPress={handleDeleteAccount}>
            <View style={styles.iconTextArea}>
              <View style={{ width: '10%' }}>
                <MaterialCommunityIcons name="trash-can-outline" size={26} color={'#C03636'} />
              </View>
              <View style={{ width: '90%' }}>
                <Text style={styles.bottomButtonText}> Șterge Contul</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.bottomDivider} />

          {/* LOGOUT BUTTON */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.iconTextArea}>
              <View style={{ width: '10%' }}>
                <MaterialCommunityIcons name="logout" size={26} color={'black'} />
              </View>
              <View style={{ width: '90%' }}>
                <Text style={styles.bottomButtonText}> Logout</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationsLabel: {
    fontSize: 16,
    fontWeight: '500',
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
  bottomButtons: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 5,
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
  notificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  notificationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#EAE9ED',
    borderRadius: 18,
    marginTop: 40,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  editProfileButton: {
    backgroundColor: 'teal',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  divider: {
    height: 1.3,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#837E7E',
  },
  iconTextArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    overflow: 'visible', // Keep this line to show the shadow on the containers
  },
  bottomButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
  },
  bottomDivider: {
    height: 1.2,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#ccc',
    marginVertical: 8,
    marginLeft: 10,
  },
});