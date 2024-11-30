import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, Modal, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/firebaseConfig';
import { ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStyles from '../hooks/useThemeStyles';
import { showSuccessToast, showErrorToast } from '../utils/toastHelpers';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

// TODO add backend connection to add events to the database

const AddEventsPage = () => {
    const { themeStyles } = useThemeStyles();

    const navigation = useNavigation();

    const scrollRef = useRef(null);
    const descriptionInputRef = useRef(null); // Ref for descriere input
    const volunteerInputRef = useRef(null); // Ref for tag input
    const responsiblePersonInputRef = useRef(null); // Ref for responsible person input
    const eventNameInputRef = useRef(null); // Ref for responsible person input
    const [showDatePicker, setShowDatePicker] = useState(false); // For modal display
    const [showDatePickerModal, setShowDatePickerModal] = useState(false); // For modal display

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [volunteers, setVolunteers] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        do {
            color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
        } while (color === '#000000');
        return color;
    };
    const [color, setColor] = useState(getRandomColor()); // Default color is randomized

    const scrollToInput = (inputRef) => {
        if (inputRef && scrollRef.current) {
            scrollRef.current.scrollToFocusedInput(inputRef);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={[themeStyles.container]}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            keyboardOpeningTime={Number.MAX_SAFE_INTEGER} // This will prevent the scroll view from jumping when the keyboard opens
            extraHeight={100}
        >
            <View style={[globalStyles.container,]}>
                <Text style={[globalStyles.title, themeStyles.text, { marginBottom: 30 }]}>Adaugă un eveniment nou</Text>

                {/* Event Name */}
                <Text style={[styles.label, themeStyles.text]}><Text style={{ color: 'red' }}>*</Text> Numele evenimentului:</Text>
                <TextInput
                    style={globalStyles.input}
                    value={eventName}
                    onChangeText={(text) => setEventName(text)}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize='words'
                    ref={eventNameInputRef}
                    onFocus={() => scrollToInput(eventNameInputRef.current)}
                    onSubmitEditing={() => descriptionInputRef.current.focus()}
                />

                {/* Event Description */}
                <Text style={[styles.label, themeStyles.text]}>Descrierea evenimentului:</Text>
                <TextInput
                    style={[globalStyles.input, styles.messageBox]}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    keyboardType="default"
                    // returnKeyType=""
                    multiline={true} // Allow multiple lines of input
                    numberOfLines={4} // Set the initial number of lines
                    ref={descriptionInputRef}
                    onFocus={() => scrollToInput(descriptionInputRef.current)}
                    onSubmitEditing={() => responsiblePersonInputRef.current.focus()}
                />

                {/* TODO add startDate picker and endDate picker with Modal */}

                {/* Task Deadline
                // <Text style={[styles.label, themeStyles.text]}>Alege o dată/perioadă pentru eveniment:</Text>
                // <TouchableOpacity onPress={showDatePicker} ref={deadlineInputRef} onFocus={() => scrollToInput(deadlineInputRef.current)}>
                //     <Text style={[globalStyles.input, themeStyles.borderRadius]}>{deadline.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: '2-digit' })}</Text>
                // </TouchableOpacity> */}

                {/* Date Picker Modal */}
                {/* <Modal
                    visible={showDatePickerModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDatePickerModal(false)} // Allows the back button to close the modal on Android
                >
                    <TouchableWithoutFeedback onPress={() => setShowDatePickerModal(false)}>
                        <View style={[styles.modalContainer, themeStyles.modalContainer]}>
                            <DateTimePicker
                                value={deadline}
                                mode='date'
                                display='spinner' // both iOS and Android get spinner style
                                // onChange={handleDateChange}
                                minimumDate={new Date()}
                                style={styles.datePicker}
                                locale='ro-RO'
                            />
                            <TouchableOpacity onPress={() => setShowDatePickerModal(false)} style={[globalStyles.button, themeStyles.button, { width: '50%' }]}>
                                <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Selectează</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal> */}

                {/* Event Responsible Person */}
                <Text style={[styles.label, themeStyles.text]}><Text style={{ color: 'red' }}>*</Text> Numele persoanelor responsabile de acest eveniment:</Text>
                <TextInput
                    style={globalStyles.input}
                    value={responsiblePerson}
                    onChangeText={(text) => setResponsiblePerson(text)}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize='words'
                    ref={responsiblePersonInputRef}
                    onFocus={() => scrollToInput(responsiblePersonInputRef.current)}
                    onSubmitEditing={() => volunteerInputRef.current.focus()}
                // onSubmitEditing={handleAddTask}
                />

                {/* Volunteers */}
                <Text style={[styles.label, themeStyles.text]}>Scrie voluntarii care participă (separați prin virgulă) (Opțional):</Text>
                <TextInput
                    style={globalStyles.input}
                    value={volunteers}
                    onChangeText={(text) => setVolunteers(text)}
                    keyboardType="default"
                    ref={volunteerInputRef}
                    onFocus={() => scrollToInput(volunteerInputRef.current)}
                />

                {/* Color Picker */}
                <Text style={[styles.label, themeStyles.text]}>Selectează culoarea evenimentului (Opțional) - Apare în Calendar:</Text>
                <ColorPicker
                    value={color}
                    onComplete={(color) => setColor(color.hex)}
                    style={{ width: '100%', height: 150, marginTop: 20 }}
                    boundedThumb={true}
                >
                    <View style={styles.colorPickerRow}>
                        <Panel1
                            style={{ flex: 1, borderRadius: 16, height: 150 }} 
                        />
                        <HueSlider
                            style={{ marginLeft: 20, borderRadius: 16, height: 150 }}
                            thumbShape='circle'
                            useNativeDriver={true}
                            vertical={true}
                        />
                    </View>
                    {/* <Panel1 style={{ flex: 1 }} />
                    <HueSlider
                        style={{ marginTop: 20, borderRadius: 20 }}
                        thumbShape='circle'
                        useNativeDriver={true}
                        vertical={true}
                    /> */}
                    {/* <OpacitySlider style={{ marginTop: 20 }} /> */}
                    {/* <Preview style={{ marginTop: 20, height: 40 }} /> */}
                    {/* <Swatches style={{ marginTop: 20 }} /> */}
                </ColorPicker>
                <TouchableOpacity onPress={() => setColor(getRandomColor())} style={[globalStyles.button, themeStyles.button, { backgroundColor: color }]}>
                    <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Culoare random</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity style={[globalStyles.button, themeStyles.button]} onPress={() => console.log("Add Event button pressed")}>
                        <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Adaugă Eveniment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkGoBack} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="chevron-left" size={16} color="#007BFF" />
                        <Text style={styles.goBackText}>Înapoi la pagina de evenimente</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        // marginBottom: 8,
    },
    colorPickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageBox: {
        height: 100,
        textAlignVertical: 'top',
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        width: '100%',
        height: '100%',
    },
    linkGoBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 16,
    },
    goBackText: {
        color: '#007BFF',
        fontSize: 14,
    },
});

export default AddEventsPage;