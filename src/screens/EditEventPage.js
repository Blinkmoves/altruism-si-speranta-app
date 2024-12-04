import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, Modal, Keyboard, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { db } from '../services/firebaseConfig';
import { ref, update, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStyles from '../hooks/useThemeStyles';
import { showSuccessToast, showErrorToast } from '../utils/toastHelpers';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

export default function EditEventPage({ route }) {

    const { themeStyles, colors } = useThemeStyles();
    
    const auth = getAuth();
    const user = auth.currentUser;
    const displayName = user.displayName;
    const navigation = useNavigation();

    // console.log('Route params: ', route.params);
    const { eventId, uid } = route.params;
    const [event, setEvent] = useState(null);
    
    const scrollRef = useRef(null);
    const descriptionInputRef = useRef(null); // Ref for descriere input
    const volunteerInputRef = useRef(null); // Ref for tag input
    const responsiblePersonInputRef = useRef(null); // Ref for responsible person input
    const eventNameInputRef = useRef(null); // Ref for responsible person input
    // State variables for showing modals
    const [showStartDatePickerModal, setShowStartDatePickerModal] = useState(false);
    const [showEndDatePickerModal, setShowEndDatePickerModal] = useState(false);

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [volunteers, setVolunteers] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // const [loading, setLoading] = useState(true);
    const [uidMismatch, setUidMismatch] = useState(false);

    const currentUid = user.uid; // Get the authenticated user's ID

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

    // console.log('Current UID:', currentUid);
    // console.log('Event uid:', uid);

    useEffect(() => {
        // Check if the authenticated user's ID matches the user ID of the task (is the owner of the task)
        if (uid !== currentUid) {
            setUidMismatch(true);
            // setLoading(false);
            showErrorToast('Accesul este interzis! Nu ești deținătorul acestui eveniment!');
            navigation.goBack();
            return;
        }
        const fetchEventData = async () => {
            const eventRef = ref(db, `events/${uid}/${eventId}`);
            const snapshot = await get(eventRef);
            if (snapshot.exists()) {
                const eventData = snapshot.val();
                // console.log('Event data:', eventData);
                setEvent(eventData);
                setDescription(eventData.description || '');
                setEventName(eventData.name);
                setStartDate(new Date(eventData.startDate));
                setEndDate(new Date(eventData.endDate));
                setResponsiblePerson(eventData.responsiblePerson);
                setVolunteers(eventData.volunteers.join(', ') || '');
                setColor(eventData.color || getRandomColor());
            }
            // setLoading(false);
        };

        fetchEventData();
    }, [eventId, uid]);

    const scrollToInput = (inputRef) => {
        if (inputRef && scrollRef.current) {
            scrollRef.current.scrollToFocusedInput(inputRef);
        }
    };

    // Handler functions for setting start and end dates
    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setEndDate(currentDate);
    };

    const handleEditEvent = () => {
        // Dismiss the keyboard
        Keyboard.dismiss();

        // Validate the mandatory fields
        if (!eventName) {
            showErrorToast('Numele evenimentului este un câmp obligatoriu!');
            return;
        }
        if (!responsiblePerson) {
            showErrorToast('Responsabilul evenimentului este un câmp obligatoriu!');
            return;
        }
        if (!startDate || !endDate) {
            showErrorToast('Data de început și data de sfârșit sunt câmpuri obligatorii!');
            return;
        }

        if (user) {
            const uid = user.uid;

            // Prepare the event data
            const updatedEventData = {
                color: color,
                createdBy: displayName,
                description: description,
                name: eventName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                responsiblePerson: responsiblePerson,
            };

            // Reference to the user's events
            const eventRef = ref(db, `events/${uid}/${eventId}`);

            // Update the event in the database
            update(eventRef, updatedEventData)
                .then(() => {
                    showSuccessToast('Evenimentul a fost actualizat cu succes!');
                    // Navigate back or to another relevant screen
                    navigation.goBack();
                })
                .catch((error) => {
                    console.error('Error updating event:', error);
                    showErrorToast('A apărut o eroare la actualizarea evenimentului.');
                });
        } else {
            showErrorToast('Trebuie să fii autentificat pentru a edita evenimentul.');
        }
    };

    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" color="#093A3E" />
    //         </View>
    //     );
    // }

    // const goToEventsPage = () => {
    //     navigation.dispatch(
    //         CommonActions.reset({
    //             index: 0,
    //             routes: [
    //                 {
    //                     name: 'AuthenticatedStack',
    //                     state: {
    //                         routes: [
    //                             {
    //                                 name: 'Evenimente',
    //                                 state: {
    //                                     routes: [
    //                                         {
    //                                             name: 'EventsPage',
    //                                         },
    //                                     ],
    //                                 },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             ],
    //         })
    //     );
    // };

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
                    // autoCapitalize='words'
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

                {/* Date Inputs in a Row */}
                <View style={styles.dateRow}>
                    <View style={[styles.dateColumn, { marginRight: 8 }]}>
                        <Text style={[styles.label, themeStyles.text]}>Dată început:</Text>
                        <TouchableOpacity
                            onPress={() => setShowStartDatePickerModal(true)}
                            style={[globalStyles.input, styles.dateInput]}
                        >
                            <Text style={[styles.dateText]}>
                                {startDate.toLocaleDateString('ro-RO')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateColumn}>
                        <Text style={[styles.label, themeStyles.text]}>Dată sfârșit:</Text>
                        <TouchableOpacity
                            onPress={() => setShowEndDatePickerModal(true)}
                            style={[globalStyles.input, styles.dateInput]}
                        >
                            <Text style={[styles.dateText]}>
                                {endDate.toLocaleDateString('ro-RO')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Start Date Picker Modal */}
                <Modal
                    visible={showStartDatePickerModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowStartDatePickerModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowStartDatePickerModal(false)}>
                        <View style={[styles.modalContainer, themeStyles.modalContainer]}>
                            <DateTimePicker
                                value={startDate}
                                mode='date'
                                display='spinner'
                                onChange={handleStartDateChange}
                                minimumDate={new Date()}
                                style={styles.datePicker}
                                locale='ro-RO'
                            />
                            <TouchableOpacity
                                onPress={() => setShowStartDatePickerModal(false)}
                                style={[globalStyles.button, themeStyles.button, { marginTop: 20, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Selectează Dată Început</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* End Date Picker Modal */}
                <Modal
                    visible={showEndDatePickerModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowEndDatePickerModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowEndDatePickerModal(false)}>
                        <View style={[styles.modalContainer, themeStyles.modalContainer]}>
                            <DateTimePicker
                                value={endDate}
                                mode='date'
                                display='spinner'
                                onChange={handleEndDateChange}
                                minimumDate={startDate}
                                style={[styles.datePicker, themeStyles.text]}
                                locale='ro-RO'
                            />
                            <TouchableOpacity onPress={() => setShowEndDatePickerModal(false)} style={[globalStyles.button, themeStyles.button, { marginTop: 20, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Selectează Dată Sfârșit</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

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
                {/* <Text style={[styles.label, themeStyles.text]}>Scrie voluntarii care participă (separați prin virgulă) (Opțional):</Text>
                <TextInput
                    style={globalStyles.input}
                    value={volunteers}
                    onChangeText={(text) => setVolunteers(text)}
                    keyboardType="default"
                    ref={volunteerInputRef}
                    onFocus={() => scrollToInput(volunteerInputRef.current)}
                /> */}

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
                    <TouchableOpacity style={[globalStyles.button, themeStyles.button]} onPress={handleEditEvent}>
                        <Text style={[globalStyles.buttonText, themeStyles.buttonText]}>Editează Eveniment</Text>
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
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    dateColumn: {
        flex: 1,
    },
    dateInput: {
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    dateText: {
        fontSize: 16,
    },
});