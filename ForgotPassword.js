import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, findNodeHandle, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import the Firebase auth instance
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from './errorMessages'; // Import the error handling function
import globalStyles from './styles';
import toastConfig from './toastConfig'; // Import custom toast configuration

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);

    const handlePasswordReset = async () => {
        Keyboard.dismiss(); // Hide the keyboard
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({
                type: 'success',
                text1: 'Un link de resetare a parolei a fost trimis la adresa de email specificată.',
                visibilityTime: 5000, // 5 seconds
                topOffset: 60,
            });
            setSuccess('Un link de resetare a parolei a fost trimis la adresa de email specificată.');
            setError('');
        } catch (error) {
            const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
            Toast.show({
                type: 'error',
                text1: friendlyErrorMessage,
                visibilityTime: 5000, // 5 seconds
                topOffset: 60,
            });
            setError(error.message);
            setSuccess('');
        }
    };

    const scrollToInput = (inputRef) => {
        if (inputRef && scrollRef.current) {
            scrollRef.current.scrollToFocusedInput(findNodeHandle(inputRef));
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollViewContent}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
        >
            <Image style={globalStyles.loginStackLogoImage} source={require('./assets/logo.png')} />
            <Text style={globalStyles.loginStackTitle}>Resetează Parola</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(''); // Clear error when user starts typing
                    if (success) setSuccess(''); // Clear success message when user starts typing
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                ref={emailInputRef} // Assign ref to email input
                onFocus={() => scrollToInput(emailInputRef.current)}
            />
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={styles.createButton} onPress={handlePasswordReset}>
                    <Text style={styles.buttonText}>Trimite link de resetare</Text>
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
    errorText: {
        color: 'red',
        marginBottom: 12,
    },
    successText: {
        color: 'green',
        marginBottom: 12,
    },
});