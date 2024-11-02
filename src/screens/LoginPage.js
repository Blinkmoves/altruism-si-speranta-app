import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import toastConfig from '../utils/toastConfig';
import globalStyles from '../styles/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Manage password visibility state
    const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Manage password focus state

    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    // IDEA: not a must but implement login by name as well
    const handleLogin = async () => {
        Keyboard.dismiss(); // Hide the keyboard
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('AuthenticatedStack', { screen: 'HomePage' });
            setError(''); // Clear error message after successful login
            // FIXME toast lower even if topOffset is 0
            Toast.show({
                type: 'success',
                text1: 'Te-ai logat cu succes!',
                visibilityTime: 2000, // 2 seconds
                topOffset: 0,
            });
            console.log('Logged in successfully');
        } catch (error) {
            const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
            Toast.show({
                type: 'error',
                text1: friendlyErrorMessage,
                visibilityTime: 5000, // 5 seconds
                topOffset: 60,
            });
            setError(error.message);
        }
    };

    const goToCreateAccount = async () => {
        navigation.navigate('CreateAccount');
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
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
            // keyboardOpeningTime={Number.MAX_SAFE_INTEGER} // Prevent the scroll view from jumping when the keyboard opens
            extraHeight={100}

        >
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Image style={globalStyles.loginStackLogoImage} source={require('../assets/logo.png')} />
            <Text style={globalStyles.loginStackTitle}>Loghează-te</Text>
            <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (error) setError(''); // Clear error when user starts typing
                    }}
                    keyboardType="email-address"
                    inputmode='email'
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCompleteType="email"
                    autoCorrect={true}
                    textContentType="emailAddress"
                    ref={emailInputRef} // Assign ref to email input
                    onFocus={() => scrollToInput(emailInputRef.current)}
                    onSubmitEditing={() => passwordInputRef.current.focus()} // Focus password input on submit
                />
                <Text style={styles.label}>Parolă</Text>
                <View style={globalStyles.passwordContainer}>
                    <TextInput
                        style={globalStyles.passwordInput}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (error) setError(''); // Clear error when user starts typing
                        }}
                        secureTextEntry={!isPasswordVisible} // Hide password if isPasswordVisible is false
                        returnKeyType="done"
                        ref={passwordInputRef} // Assign ref to password input
                        onFocus={() => {
                            scrollToInput(passwordInputRef.current)
                            setIsPasswordFocused(true); // Set isPasswordFocused to true when password input is focused
                        }}
                        onBlur={() => setIsPasswordFocused(false)} // Set isPasswordFocused to false when password input is blurred
                        onSubmitEditing={handleLogin} // Call login function on submit
                    />
                    <TouchableOpacity
                        style={globalStyles.passwordIconContainer}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.rowButtonsArea}>
                    <TouchableOpacity style={styles.link} onPress={goToCreateAccount}>
                        <Text style={styles.createAccountText}>Creează cont</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link} onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Ai uitat parola?</Text>
                    </TouchableOpacity>
                </View>
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
    input: {
        height: 40,
        borderColor: '#093A3E',
        borderWidth: 1.2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#60908C',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        alignItems: 'center',
        marginBottom: 12,
    },
    createAccountText: {
        color: 'black',
        fontSize: 14,
        borderWidth: 1.2,
        borderRadius: 10,
        borderColor: '#60908C',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    forgotPasswordText: {
        color: '#007BFF',
        fontSize: 14,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonsArea: {
        marginTop: 20,
    },
    rowButtonsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        alignItems: 'center',
    },
});