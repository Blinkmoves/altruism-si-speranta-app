import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/themeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
    theme: lightTheme,
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(lightTheme); // Initialize with light theme

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = theme.dark ? lightTheme : darkTheme;
            setTheme(newTheme);
            console.log("Theme has changed: ", theme.dark ? "light" : "dark");
            await AsyncStorage.setItem('theme', newTheme.dark ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to toggle theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);