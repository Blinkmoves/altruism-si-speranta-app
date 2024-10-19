import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import the Firebase auth instance
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from './errorMessages'; // Import the error handling function
import toastConfig from './toastConfig'; // Import custom toast configuration
import commonStyles from './styles';

export default function CreateAccount({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const scrollRef = useRef(null);
    const emailInputRef = useRef(null); // Ref for email input
    const passwordInputRef = useRef(null); // Ref for password input

    const handleCreateAccount = async () => {
        Keyboard.dismiss(); // Hide the keyboard
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Toast.show({
                type: 'success',
                text1: 'Contul a fost creat cu succes!',
                visibilityTime: 2000, // 2 seconds
                topOffset: 60,
            });
            setError(''); // Clear error message after successful account creation
            setTimeout(() => {
                navigation.navigate('HomePage'); // Navigate to the HomePage after a delay
            }, 2000); // Adjust the delay as needed
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
            <Image style={styles.logoImage} source={require('./assets/logo.jpg')} />
            <Text style={styles.title}>Creează un cont nou</Text>
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
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError(''); // Clear error when user starts typing
                }}
                returnKeyType="done"
                secureTextEntry
                ref={passwordInputRef} // Assign ref to password input
                onFocus={() => scrollToInput(passwordInputRef.current)} // Pass ref to scroll function
                onSubmitEditing={handleCreateAccount} // Call create account function on submit
            />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonsArea: {
        marginTop: 20,
    },
    logoImage: {
        alignSelf: 'center',
        width: 180,
        height: 180,
        resizeMode: 'contain',  // Prevents stretching and layout overflow
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