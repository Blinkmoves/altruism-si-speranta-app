import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/themeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

const ThemeContext = createContext({
    theme: lightTheme,
    toggleTheme: () => {},
    isReloading: false,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(lightTheme);

    const [isReloading, setIsReloading] = useState(false);

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

            setIsReloading(true);

            // Allow the Activity Indicator to render before reloading
            setTimeout(async () => {
              await Updates.reloadAsync();
            }, 100); // Adjust the delay as needed

            // await Updates.reloadAsync();  // Reload the app to apply the new theme (safe way to not break the Agenda)
        } catch (error) {
            console.error('Failed to toggle theme:', error);
            setIsReloading(false);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isReloading }}>
            {children}
        </ThemeContext.Provider>
    );
};
