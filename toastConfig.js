import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import commonStyles from './styles';

// Custom Toast configuration
const toastConfig = {
    success: ({ text1, props }) => (
        <View style={commonStyles.successToast}>
            <MaterialCommunityIcons name="check-circle" size={24} color="white" />
            <Text style={commonStyles.toastText}>{text1}</Text>
        </View>
    ),
    error: ({ text1, props }) => (
        <View style={commonStyles.errorToast}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
            <Text style={commonStyles.toastText}>{text1}</Text>
        </View>
    ),
};

export default toastConfig;