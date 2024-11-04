import { StyleSheet } from 'react-native';

export const createThemeStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        text: {
            color: theme.colors.text,
        },
        button: {
            backgroundColor: theme.colors.primary,
            padding: 10,
            borderRadius: 5,
        },
        buttonText: {
            color: theme.colors.text,
            textAlign: 'center',
        },
        // TODO: Add to globalStyles
    });
};

export const lightTheme = {
    dark: false,
    colors: {
        primary: '#ffffff',
        background: '#f0f0f0',
        card: '#ffffff',
        text: '#000000',
        border: '#cccccc',
        notification: '#ff453a',
    },
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#000000',
        background: '#121212',
        card: '#1e1e1e',
        text: '#ffffff',
        border: '#272727',
        notification: '#ff453a',
    },
};