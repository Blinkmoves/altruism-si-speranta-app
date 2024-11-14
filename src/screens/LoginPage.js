import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import globalStyles from '../styles/globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStyles from '../hooks/useThemeStyles';

export default function Login({ navigation }) {
    
    const { themeStyles, colors } = useThemeStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Manage password visibility state
    const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Manage password focus state

    const scrollRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const handleLogin = async () => {
        Keyboard.dismiss(); // Hide the keyboard
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // navigation.navigate('AuthenticatedStack', { screen: 'HomePage' });

            setError(''); // Clear error message after successful login
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
            style={[styles.container, themeStyles.container]}
            contentContainerStyle={styles.scrollViewContent}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            // keyboardOpeningTime={Number.MAX_SAFE_INTEGER} // Prevent the scroll view from jumping when the keyboard opens
            extraHeight={100}

        >
            <StatusBar backgroundColor={colors.statusbar} />
            <Image style={globalStyles.loginStackLogoImage} source={require('../assets/logo.png')} />
            <Text style={[globalStyles.loginStackTitle, themeStyles.text]}>Loghează-te</Text>
            <View>
                <Text style={[styles.label, themeStyles.text]}>Email</Text>
                <TextInput
                    style={globalStyles.loginInput}
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
                <Text style={[styles.label, themeStyles.text]}>Parolă</Text>
                <View style={[globalStyles.passwordContainer, { paddingLeft: 0 }]}>
                    <TextInput
                        style={[globalStyles.loginInput, { flex: 1, borderColor: 'transparent', paddingVertical: 0, marginBottom: 0 }]}
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
                <TouchableOpacity style={[styles.loginButton, themeStyles.loginButton]} onPress={handleLogin}>
                    <Text style={[styles.loginButtonText, themeStyles.buttonText]}>Login</Text>
                </TouchableOpacity>
                <View style={styles.rowButtonsArea}>
                    <TouchableOpacity style={styles.link} onPress={goToCreateAccount}>
                        <Text style={[styles.createAccountText, themeStyles.text]}>Creează cont</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link} onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Ai uitat parola?</Text>
                    </TouchableOpacity>
                </View>
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
    loginButton: {
        // backgroundColor: '#60908C',
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