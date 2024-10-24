import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import the Firebase auth instance
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from './errorMessages'; // Import the error handling function
import toastConfig from './toastConfig'; // Import custom toast configuration
import commonStyles from './styles';

export default function CreateAccount({ navigation, setIsAuthenticated }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Manage password visibility state

    const scrollRef = useRef(null);
    const nameInputRef = useRef(null); // Ref for name input
    const emailInputRef = useRef(null); // Ref for email input
    const passwordInputRef = useRef(null); // Ref for password input

    const handleCreateAccount = async () => {
        Keyboard.dismiss(); // Hide the keyboard
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            setError(''); // Clear error message after successful account creation
            setIsAuthenticated(true); // Set the authenticated state to true
            navigation.navigate('AuthenticatedStack', { screen: 'HomePage' });
            // FIXME toast not shown after account creation
            Toast.show({
                type: 'success',
                text1: 'Contul a fost creat cu succes!',
                visibilityTime: 3000, // 2 seconds
                topOffset: 20,
            });
        } catch (error) {
            const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
            Toast.show({
                type: 'error',
                text1: friendlyErrorMessage,
                visibilityTime: 5000, // 5 seconds
                topOffset: 60,
            });
            setError(error.message);
            console.log(error);
        }
    };

    const scrollToInput = (inputRef) => {
        if (inputRef && scrollRef.current) {
            scrollRef.current.scrollToFocusedInput(inputRef);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollViewContent}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            // keyboardOpeningTime={Number.MAX_SAFE_INTEGER} // This will prevent the scroll view from jumping when the keyboard opens
            extraHeight={100}
        >
            <Image style={commonStyles.loginStackLogoImage} source={require('./assets/logo.png')} />
            <Text style={commonStyles.loginStackTitle}>Creează un cont nou</Text>
            <Text style={styles.label}>Nume complet</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    if (error) setError(''); // Clear error when user starts typing
                }}
                returnKeyType="next"
                autoCapitalize="words"
                ref={nameInputRef}
                onFocus={() => scrollToInput(nameInputRef.current)}
                onSubmitEditing={() => emailInputRef.current.focus()} // Focus email input on submit
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(''); // Clear error when user starts typing
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                ref={emailInputRef} // Assign ref to email input
                onFocus={() => scrollToInput(emailInputRef.current)}
                onSubmitEditing={() => passwordInputRef.current.focus()} // Focus password input on submit
            />
            <Text style={styles.label}>Parolă</Text>
            <View style={commonStyles.passwordContainer}>
                <TextInput
                    style={commonStyles.passwordInput}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (error) setError(''); // Clear error when user starts typing
                    }}
                    returnKeyType="done"
                    secureTextEntry={!isPasswordVisible} // Hide password if isPasswordVisible is false
                    ref={passwordInputRef} // Assign ref to password input
                    onFocus={() => scrollToInput(passwordInputRef.current)} // Pass ref to scroll function
                    onSubmitEditing={handleCreateAccount} // Call create account function on submit
                />
                <TouchableOpacity
                    style={commonStyles.passwordIconContainer}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <MaterialCommunityIcons
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
                    <Text style={styles.buttonText}>Creează cont</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={16} color="#007BFF" />
                    <Text style={styles.goToLoginText}>Înapoi la Login</Text>
                </TouchableOpacity>
            </View>
            <Toast config={toastConfig} />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 48,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#093A3E',
        borderWidth: 1.2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
    },
    createButton: {
        backgroundColor: '#60908C',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsArea: {
        marginTop: 20,
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    goToLoginText: {
        color: '#007BFF',
        fontSize: 14,
    },
});