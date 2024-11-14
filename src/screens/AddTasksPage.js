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

// TODO Add admin logic so only admins can create tasks

// FIXME see why error permission denied when adding a task

const AddTasksPage = () => {

    const { themeStyles, colors } = useThemeStyles();

    const auth = getAuth();
    const user = auth.currentUser;
    const navigation = useNavigation();

    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);

    const [deadline, setDeadline] = useState(new Date());
    const [showDatePickerModal, setShowDatePickerModal] = useState(false); // For modal display

    const scrollRef = useRef(null);
    const descriereInputRef = useRef(null); // Ref for descriere input
    const tagInputRef = useRef(null); // Ref for tag input
    const deadlineInputRef = useRef(null); // Ref for deadline input
    const responsiblePersonInputRef = useRef(null); // Ref for responsible person input

    const handleAddTask = async () => {
        // Dismiss the keyboard
        Keyboard.dismiss();

        // Validate the task description and responsible person fields
        if (!description) {
            showErrorToast('Descrierea task-ului este un câmp obligatoriu!');
            return;
        }
        if (!responsiblePerson) {
            showErrorToast('Responsabilul task-ului este un câmp obligatoriu!');
            return;
        }

        if (user) {
            const uid = user.uid;
            const displayName = user.displayName;
            try {
                const taskRef = ref(db, `tasks/${uid}`); // Reference to the tasks collection for the authenticated user
                const newTaskRef = push(taskRef);
                const newTask = {
                    description,
                    tags: tags.split(',').map(tag => tag.trim()),
                    deadline: deadline.toString(),
                    responsiblePerson,
                    createdBy: displayName,
                    isCompleted: false,
                };
                await set(newTaskRef, newTask);
                setTasks([...tasks, { id: newTaskRef.key, ...newTask }]);
                setDescription('');
                setTags('');
                setDeadline(new Date());
                setResponsiblePerson('');
                setIsCompleted(false);

                showSuccessToast('Task adăugat cu succes!');
                setTimeout(() => {
                    navigation.navigate('TasksPage');
                }, 2000);
            } catch (error) {
                showErrorToast('A apărut o eroare la adăugarea task-ului!');
                console.error('Error adding task: ', error);
            }
        }
    };

    const scrollToInput = (inputRef) => {
        if (inputRef && scrollRef.current) {
            scrollRef.current.scrollToFocusedInput(inputRef);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || deadline;
        setShowDatePickerModal(Platform.OS === 'ios'); // Close modal on date select
        setDeadline(currentDate);
    };

    const showDatePicker = () => {
        setShowDatePickerModal(true); // Show modal for date picker
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
                <Text style={[globalStyles.title, themeStyles.text, { marginBottom: 30 }]}>Adaugă un Task nou</Text>

                {/* Task Description */}
                <Text style={[styles.label, themeStyles.text]}><Text style={{ color: 'red' }}>*</Text> Descrierea task-ului:</Text>
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
                <Text style={[styles.label, themeStyles.text]}>Alege un deadline pentru task:</Text>
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
                                onChange={handleDateChange}
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
                    onSubmitEditing={handleAddTask}
                />
                <View>
                    <TouchableOpacity style={[globalStyles.button, themeStyles.button]} onPress={handleAddTask}>
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
    label: {
        fontSize: 16,
    },
    messageBox: {
        height: 100,
        textAlignVertical: 'top',
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

export default AddTasksPage;