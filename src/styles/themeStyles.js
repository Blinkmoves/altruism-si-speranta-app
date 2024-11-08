import { StyleSheet } from 'react-native';

export const createThemeStyles = (theme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
        },
        text: {
            color: theme.colors.text,
        },
        textGray: {
            color: theme.colors.textGray,
        },
        button: {
            backgroundColor: theme.colors.button,
        },
        purpleButton: {
            backgroundColor: theme.colors.chip,
        },
        loginButton: {
            backgroundColor: theme.colors.loginButton,
        },
        buttonText: {
            color: theme.colors.text,
        },
        chip: {
            backgroundColor: theme.colors.chip,
        },
        rowBack: {
            backgroundColor: theme.colors.rowBack,
        },
        notificationContainer: {
            backgroundColor: theme.colors.notification,
        },
        buttonText: {
            color: theme.colors.buttonText,
        },
        modalContainer: {
            backgroundColor: theme.colors.modal,
        },
        // BorderRadius hack for dark theme
        borderRadius: {
            borderRadius: theme.colors.borderRadius,
        },
    });
};

export const lightTheme = {
    dark: false,
    colors: {
        primary: '#ffffff',
        background: '#ffffff',
        text: '#000000',
        textGray: '#333333',
        tabBarBackground: '#093A3E',
        tabBarActiveTint: '#ffffff',
        tabBarInactiveTint: '#a0a3a3',
        chip: '#976E9E',
        rowBack: '#ddd',
        button: 'teal',
        notification: '#EAE9ED',
        switchTrack: '#4D3D5B',
        scrollbar: 'black',
        statusbar: '#000',
        loginButton: '#60908C',
        buttonText: '#fff',
        modal: '#121212',
        borderRadius: 5, // BorderRadius hack for dark theme
    },
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#000000',
        background: '#121212',
        text: '#ffffff',
        textGray: '#ababab',
        tabBarBackground: '#002223',
        tabBarActiveTint: '#ffffff',
        tabBarInactiveTint: '#a0a3a3',
        chip: '#513B5C',
        rowBack: '#595959',
        button: '#002223',
        notification: '#2D2D2D',
        switchTrack: '#976E9E',
        scrollbar: 'white',
        statusbar: '#fff',
        loginButton: '#093A3E',
        buttonText: '#fff',
        modal: '#121212',
        borderRadius: 0, // BorderRadius hack for dark theme
    },
};