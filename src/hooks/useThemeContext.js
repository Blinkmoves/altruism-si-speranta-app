import React, { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from '../styles/themeStyles';

const ThemeContext = createContext({
    theme: lightTheme,
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(lightTheme); // Initialize with light theme

    const toggleTheme = () => {
        setTheme(theme === darkTheme ? lightTheme : darkTheme);
        console.log("Theme has changed: ", theme.dark ? "light" : "dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);