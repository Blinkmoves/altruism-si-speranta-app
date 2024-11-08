import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    button: {
        // backgroundColor: 'teal',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
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
        backgroundColor: '#20c961',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    errorToast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c92031',
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
        borderColor: 'teal',
        borderWidth: 1.2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    // passwordInput: {
    //     flex: 1,
    //     fontSize: 16,
    // },
    // passwordIconContainer: {
    //     padding: 8,
    // },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    headerLogo: {
        width: 40,
        height: 30,
        marginRight: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    loginStackLogoImage: {
        alignSelf: 'center',
        width: 180,
        height: 180,
        resizeMode: 'contain',
    },
    loginStackTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    input: {
        width: '100%',
        // height: 40,
        padding: 10,
        marginVertical: 10,
        borderWidth: 1.2,
        borderColor: 'teal',
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'white',
    },
    loginInput: {
        height: 40,
        borderColor: 'teal',
        borderWidth: 1.2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
        fontSize: 16,
        backgroundColor: 'white',
    }
});

export default globalStyles;