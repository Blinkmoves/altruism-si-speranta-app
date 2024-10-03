import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    Button: {
        backgroundColor: 'teal',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    ButtonText: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
      },
});

export default commonStyles;