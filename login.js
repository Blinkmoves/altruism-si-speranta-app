import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import commonStyles from './styles';

// TODO: implement the login functionality using firebase auth

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login button pressed');
    };

    const handleCreateAccount = () => {
        console.log('Create account button pressed');
    };

    const handleForgotPassword = () => {
        console.log('Forgot password button pressed');
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logoImage} source={require('./assets/logo.jpg')} />
            <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Parolă</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonsArea}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.rowButtonsArea}>
                    <TouchableOpacity style={styles.link} onPress={handleCreateAccount}>
                        <Text style={styles.createAccountText}>Crează cont</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link} onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Ai uitat parola?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 48,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 40,
        borderColor: '#093A3E',
        borderWidth: 1.2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
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
    logoImage: {
        alignSelf: 'center',
        width: 180,
        height: 180,
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