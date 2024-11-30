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

const AddEventsPage = () => {
    const { themeStyles } = useThemeStyles();

    const navigation = useNavigation();

    const scrollRef = useRef(null);
    const descriereInputRef = useRef(null); // Ref for descriere input
    const tagInputRef = useRef(null); // Ref for tag input
    const deadlineInputRef = useRef(null); // Ref for deadline input
    const responsiblePersonInputRef = useRef(null); // Ref for responsible person input
    const numeEvenimentInputRef = useRef(null); // Ref for responsible person input
    const [showDatePicker, setShowDatePicker] = useState(false); // For modal display
    const [showDatePickerModal, setShowDatePickerModal] = useState(false); // For modal display

    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [numeEveniment, setNumeEveniment] = useState('');

    const [deadline, setDeadline] = useState(new Date());

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
                    value={numeEveniment}
                    onChangeText={(text) => setNumeEveniment(text)}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize='words'
                    ref={numeEvenimentInputRef}
                    onFocus={() => scrollToInput(numeEvenimentInputRef.current)}
                    onSubmitEditing={() => descriereInputRef.current.focus()}
                />

                {/* Event Description */}
                <Text style={[styles.label, themeStyles.text]}><Text style={{ color: 'red' }}>*</Text> Descrierea evenimentului:</Text>
                <TextInput
                    style={[globalStyles.input, styles.messageBox]}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    keyboardType="default"
                    returnKeyType="next"
                    multiline={true} // Allow multiple lines of input
                    numberOfLines={4} // Set the initial number of lines
                    ref={descriereInputRef}
                    onFocus={() => scrollToInput(descriereInputRef.current)}
                    onSubmitEditing={() => tagInputRef.current.focus()}
                />

                {/* Task Tags */}
                <Text style={[styles.label, themeStyles.text]}>Scrie tag-urile separate prin virgulă (cum ar fi: lejer, urgent sau orice alt tag relevant):</Text>
                <TextInput
                    style={globalStyles.input}
                    value={tags}
                    onChangeText={(text) => setTags(text)}
                    keyboardType="default"
                    ref={tagInputRef}
                    onFocus={() => scrollToInput(tagInputRef.current)}
                />

                {/* Task Deadline */}
                <Text style={[styles.label, themeStyles.text]}>Alege o dată/perioadă pentru eveniment:</Text>
                <TouchableOpacity onPress={showDatePicker} ref={deadlineInputRef} onFocus={() => scrollToInput(deadlineInputRef.current)}>
                    <Text style={[globalStyles.input, themeStyles.borderRadius]}>{deadline.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: '2-digit' })}</Text>
                </TouchableOpacity>

                {/* Date Picker Modal */}
                <Modal
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
                </Modal>

                {/* Task Responsible Person */}
                <Text style={[styles.label, themeStyles.text]}><Text style={{ color: 'red' }}>*</Text> Numele persoanei responsabile de acest task:</Text>
                <TextInput
                    style={globalStyles.input}
                    value={responsiblePerson}
                    onChangeText={(text) => setResponsiblePerson(text)}
                    keyboardType="default"
                    returnKeyType="done"
                    autoCapitalize='words'
                    ref={responsiblePersonInputRef}
                    onFocus={() => scrollToInput(responsiblePersonInputRef.current)}
                // onSubmitEditing={handleAddTask}
                />
                <View>
                    <TouchableOpacity style={[globalStyles.button, themeStyles.button]}>
                        <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Adaugă Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkGoBack} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="chevron-left" size={16} color="#007BFF" />
                        <Text style={styles.goBackText}>Înapoi la pagina de task-uri</Text>
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