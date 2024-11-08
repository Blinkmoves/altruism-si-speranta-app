import { createThemeStyles } from '../styles/themeStyles';
import { useThemeContext } from '../hooks/useThemeContext';

const useThemeStyles = () => {
  const { theme } = useThemeContext();  // Get the current theme from your context
  const themeStyles = createThemeStyles(theme);  // Pass the theme to createThemeStyles
  return { themeStyles, colors: theme.colors };
};

export default useThemeStyles;