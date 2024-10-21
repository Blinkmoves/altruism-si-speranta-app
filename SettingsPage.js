import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import commonStyles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from './errorMessages'; // Import the error handling function
import toastConfig from './toastConfig'; // Import custom toast configuration

export default function SettingsPage() {

  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState(auth.currentUser?.password || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [isEditingAccountData, setIsEditingAccountData] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false); // Manage password visibility state
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false); // Manage password visibility state
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Manage password visibility state


  const buttonTextStyle = commonStyles.ButtonText;
  const fontSize = buttonTextStyle.fontSize || 16; // Default to 16 if fontSize is not defined

  const scrollRef = useRef(null);
  const nameInputRef = useRef(null); // Ref for name input
  const emailInputRef = useRef(null); // Ref for email input
  const currentPasswordInputRef = useRef(null); // Ref for password input
  const newPasswordInputRef = useRef(null); // Ref for password input
  const confirmPasswordInputRef = useRef(null); // Ref for password input

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsEditingAccountData(false); // Reset the state when the screen loses focus
        setIsChangingPassword(false); // Reset the state when the screen loses focus
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      };
    }, [])
  );


  const scrollToInput = (inputRef) => {
    if (inputRef && scrollRef.current) {
      scrollRef.current.scrollToFocusedInput(inputRef);
    }
  };

  const handleLogout = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      await signOut(auth);
      Toast.show({
        type: 'success',
        text1: 'Te-ai delogat cu succes!',
        visibilityTime: 2000, // 2 seconds
        topOffset: 60,
      });
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

  // UPDATE ACCOUNT DATA AND PASSWORD LOGIC START
  const handleUpdateAccountData = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Nu există niciun utilizator autentificat.',
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
      return;
    }

    try {
      await updateProfile(user, {
        displayName: name,
      });
      await updateEmail(user, email);
      Toast.show({
        type: 'success',
        text1: 'Datele contului au fost actualizate cu succes!',
        visibilityTime: 3000, // 3 seconds
        topOffset: 20,
      });
    } catch (error) {
      const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
      Toast.show({
        type: 'error',
        text1: friendlyErrorMessage,
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
    }
  }

  const handleChangePassword = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Nu există niciun utilizator autentificat.',
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
      return;
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Parolele nu se potrivesc.',
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
      return;
    }

    // Check if the new password is the same as the current password
    if (currentPassword === newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Parola nouă trebuie să fie diferită de parola actuală.',
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      // Sign out the user after changing the password
      await signOut(auth);
      Toast.show({
        type: 'success',
        text1: 'Parola a fost schimbată cu succes!',
        visibilityTime: 3000, // 3 seconds
        topOffset: 60,
      });
    } catch (error) {
      const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
      console.log(error);
      Toast.show({
        type: 'error',
        text1: friendlyErrorMessage,
        visibilityTime: 5000, // 5 seconds
        topOffset: 20,
      });
    }
  };


  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: 'white' }]}
      contentContainerStyle={styles.scrollViewContent}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      ref={scrollRef}
      // keyboardOpeningTime={Number.MAX_SAFE_INTEGER} // This will prevent the scroll view from jumping when the keyboard opens
      extraHeight={100}
    >
      <View style={commonStyles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View>
            <Text style={commonStyles.title}>Editează Profilul</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setIsEditingAccountData(!isEditingAccountData)}
            >
              <Text style={commonStyles.ButtonText}>Modifică Datele Contului</Text>
            </TouchableOpacity>

            {isEditingAccountData && (
              <View style={styles.innerContainer}>
                <Text style={styles.label}>Nume</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="done"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  ref={nameInputRef}
                  onFocus={() => scrollToInput(nameInputRef.current)}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  returnKeyType="done"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  ref={emailInputRef}
                  onFocus={() => scrollToInput(emailInputRef.current)}
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdateAccountData}
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
                {/* Current password */}
                <Text style={[styles.label, { marginBottom: 10 }]}>Introdu Parola Actuală</Text>
                <View style={[commonStyles.passwordContainer, { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }]}>
                  <TextInput
                    style={commonStyles.passwordInput}
                    secureTextEntry={!isCurrentPasswordVisible}
                    returnKeyType="next"
                    value={currentPassword}
                    onChangeText={(text) => setCurrentPassword(text)}
                    ref={currentPasswordInputRef}
                    onFocus={() => scrollToInput(currentPasswordInputRef.current)}
                    onSubmitEditing={() => newPasswordInputRef.current.focus()}
                  />
                  <TouchableOpacity
                    style={commonStyles.passwordIconContainer}
                    onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                  >
                    <MaterialCommunityIcons
                      name={isCurrentPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {/* New password */}
                <Text style={[styles.label, { marginBottom: 10 }]}>Parolă Nouă</Text>
                <View style={[commonStyles.passwordContainer, { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }]}>
                  <TextInput
                    style={commonStyles.passwordInput}
                    secureTextEntry={!isNewPasswordVisible}
                    returnKeyType="next"
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                    ref={newPasswordInputRef}
                    onFocus={() => scrollToInput(newPasswordInputRef.current)}
                    onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
                  />
                  <TouchableOpacity
                    style={commonStyles.passwordIconContainer}
                    onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  >
                    <MaterialCommunityIcons
                      name={isNewPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm new password */}
                <Text style={[styles.label, { marginBottom: 10 }]}>Confirmă Parola Nouă</Text>
                <View style={[commonStyles.passwordContainer, { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }]}>
                  <TextInput
                    style={commonStyles.passwordInput}
                    secureTextEntry={!isConfirmPasswordVisible}
                    returnKeyType="done"
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    ref={confirmPasswordInputRef}
                    onFocus={() => scrollToInput(confirmPasswordInputRef.current)}
                    onSubmitEditing={handleChangePassword}
                  />
                  <TouchableOpacity
                    style={commonStyles.passwordIconContainer}
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  >
                    <MaterialCommunityIcons
                      name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleChangePassword}
                >
                  <Text style={commonStyles.ButtonText}>Salvează Parola</Text>
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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  notificationsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    // height: 40,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4D3D5B',
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