import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, findNodeHandle, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import globalStyles from '../styles/globalStyles';
import useThemeStyles from '../hooks/useThemeStyles';
import { showSuccessToast, showErrorToast } from '../utils/toastHelpers';

export default function ForgotPassword({ navigation }) {

    const { themeStyles, colors } = useThemeStyles();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);

    const handlePasswordReset = async () => {
        Keyboard.dismiss(); // Hide the keyboard
        try {
            await sendPasswordResetEmail(auth, email);

            showSuccessToast('Un link de resetare a parolei a fost trimis la adresa de email specificată.');
            setError('');
        } catch (error) {
            const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
            showErrorToast(friendlyErrorMessage);
            setError(error.message);
        }
    };

    const scrollToInput = (inputRef) => {
        if (inputRef && scrollRef.current) {
            scrollRef.current.scrollToFocusedInput(findNodeHandle(inputRef));
        }
    };

    return (
        <KeyboardAwareScrollView
            style={[styles.container, themeStyles.container]}
            contentContainerStyle={styles.scrollViewContent}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
        >
            <Image style={globalStyles.loginStackLogoImage} source={require('../assets/logo.png')} />
            <Text style={[globalStyles.loginStackTitle, themeStyles.text]}>Resetează Parola</Text>
            <Text style={[styles.label, themeStyles.text]}>Email</Text>
            <TextInput
                style={globalStyles.loginInput}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(''); // Clear error when user starts typing
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                ref={emailInputRef} // Assign ref to email input
                onFocus={() => scrollToInput(emailInputRef.current)}
            />
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={[styles.createButton, themeStyles.loginButton]} onPress={handlePasswordReset}>
                    <Text style={[styles.buttonText, themeStyles.buttonText]}>Trimite link de resetare</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={16} color="#007BFF" />
                    <Text style={styles.goToLoginText}>Înapoi la Login</Text>
                </TouchableOpacity>
            </View>
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