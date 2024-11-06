import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';

// Custom Toast configuration
const toastConfig = {
    success: ({ text1, props }) => (
        <View style={globalStyles.successToast}>
            <MaterialCommunityIcons name="check-circle" size={24} color="white" />
            <Text style={globalStyles.toastText}>{text1}</Text>
        </View>
    ),
    error: ({ text1, props }) => (
        <View style={globalStyles.errorToast}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
            <Text style={globalStyles.toastText}>{text1}</Text>
        </View>
    ),
};

export default toastConfig;