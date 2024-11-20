import Toast from "react-native-toast-message";

export const showSuccessToast = (message) => {
    Toast.show({
        type: 'success',
        text1: message,
    });
};

export const showErrorToast = (message) => {
    Toast.show({
        type: 'error',
        text1: message,
    });
};

export const showInfoToast = (message) => {
    Toast.show({
        type: 'info',
        text1: message,
    });
};