import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { set, ref } from 'firebase/database';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import globalStyles from '../styles/globalStyles';
import useThemeStyles from '../hooks/useThemeStyles';
import { showSuccessToast, showErrorToast } from '../utils/toastHelpers';

export default function CreateAccount({ navigation, setIsAuthenticated }) {

    const { themeStyles, colors } = useThemeStyles();

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
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });

            // Store the users data in the database (including role)
            await set(ref(db, `users/${user.uid}`), {
                name: name,
                email: email,
                role: 'Voluntar',
            });

            // TODO/IDEA add email verification

            setError(''); // Clear error message after successful account creation
            // FIXME: got this error LOG  [TypeError: setIsAuthenticated is not a function (it is undefined)]:
            showSuccessToast('Contul a fost creat cu succes!');
            setTimeout(() => {
                setIsAuthenticated(true);
            }, 3000);
            // navigation.navigate('AuthenticatedStack', { screen: 'HomePage' });
            
            // FIXME toast not shown after account creation
        } catch (error) {
            const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
            showErrorToast(friendlyErrorMessage);
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
            style={[styles.container, themeStyles.container]}
            contentContainerStyle={styles.scrollViewContent}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            // keyboardOpeningTime={Number.MAX_SAFE_INTEGER} // This will prevent the scroll view from jumping when the keyboard opens
            extraHeight={100}
        >
            <Image style={globalStyles.loginStackLogoImage} source={require('../assets/logo.png')} />
            <Text style={[globalStyles.loginStackTitle, themeStyles.text]}>Creează un cont nou</Text>
            <Text style={[styles.label, themeStyles.text]}>Nume complet</Text>
            <TextInput
                style={globalStyles.loginInput}
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
                returnKeyType="next"
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
                    returnKeyType="done"
                    secureTextEntry={!isPasswordVisible} // Hide password if isPasswordVisible is false
                    ref={passwordInputRef} // Assign ref to password input
                    onFocus={() => scrollToInput(passwordInputRef.current)} // Pass ref to scroll function
                    onSubmitEditing={handleCreateAccount} // Call create account function on submit
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
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={[styles.createButton, themeStyles.loginButton]} onPress={handleCreateAccount}>
                    <Text style={[styles.buttonText, themeStyles.buttonText]}>Creează cont</Text>
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