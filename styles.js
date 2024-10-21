import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
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
        marginVertical: 16,
        textAlign: 'center',
    },
    successToast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#20c961', // Green background with transparency
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    errorToast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c92031', // Red background with transparency
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    toastText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#093A3E',
        borderWidth: 1.2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
    },
    passwordIconContainer: {
        padding: 8,
    },
});

export default commonStyles;