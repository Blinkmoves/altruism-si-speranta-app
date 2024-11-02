import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { auth } from './firebaseConfig';
import globalStyles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deleteTask, editTask, completeTask } from './taskActions';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import toastConfig from './toastConfig';

const TaskShowPage = ({ route }) => {
    const { taskId } = route.params;
    const [task, setTask] = useState([]);
    const [tasks, setTasks] = useState([]);

    const navigation = useNavigation();

    // Get user ID from Firebase Auth
    const uid = auth.currentUser.uid;

    useEffect(() => {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        const unsubscribe = onValue(taskRef, (snapshot) => {
            const data = snapshot.val();
            setTask(data);
        });

        return () => unsubscribe();
    }, [taskId, uid]);

    if (!task) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#093A3E" />
            </View>
        );
    }

    // console.log('User ID:', uid);
    // console.log('Task:', task);
    // console.log('Task ID:', taskId);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: '2-digit' });
    };

    // Handle task actions
    const handleCompleteTask = async (taskId, uid) => {
        const successComplete = await completeTask(taskId, uid, setTasks, tasks);
        if (successComplete) {
            // Delay the navigation to allow the Toast message to show
            setTimeout(() => {
                navigation.goBack()
            }, 2000);
        }
    };

    const handleDeleteTask = async (taskId, uid) => {
        const successDelete = await deleteTask(taskId, uid, setTasks);
        if (successDelete) {
            // Delay the navigation to allow the Toast message to show
            setTimeout(() => {
                navigation.goBack()
            }, 2000);
        }
    };

    // TODO: Edit task
    const handleEditTask = (taskId, uid, updatedTask) => {
        editTask(taskId, uid, updatedTask);
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Detaliile Task-ului</Text>

                {/* Task Description */}
                <View style={styles.row}>
                    <View style={styles.taskDetails}>
                        <Text style={styles.label}>Descriere: </Text>
                        <Text style={styles.value}>{task.description}</Text>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.row}>
                    <View style={styles.taskDetails}>
                        <Text style={styles.label}>Tags: </Text>
                        <View style={styles.chipContainer}>
                            {task.tags && task.tags.length > 0 ? (
                                task.tags.map((tag, tagIndex) => (
                                    <View key={tagIndex} style={styles.chip}>
                                        <Text style={styles.chipText}>{tag}</Text>
                                    </View>
                                ))
                            ) : null}
                        </View>
                    </View>
                </View>

                {/* Deadline */}
                <View style={styles.row}>
                    <View style={styles.taskDetails}>
                        <Text style={styles.label}>Deadline: </Text>
                        <Text style={styles.value}> {formatDate(task.deadline)}</Text>
                    </View>
                </View>

                {/* Responsible Person */}
                <View style={styles.row}>
                    <View style={styles.taskDetails}>
                        <Text style={styles.label}>Responsabil: </Text>
                        <Text style={styles.value}>{task.responsiblePerson}</Text>
                    </View>
                </View>

                {/* Bottom buttons area */}
                {/* Mark as completed */}
                <View>
                    <TouchableOpacity
                        style={[globalStyles.Button, { flex: 1 }]}
                        onPress={handleEditTask}
                    >
                        <Text style={globalStyles.ButtonText}>Editează</Text>
                    </TouchableOpacity>
                </View>

                {/* Edit and Delete task in the same row */}
                <View style={styles.bottomButtonsRow}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={[globalStyles.Button, { backgroundColor: 'green', marginRight: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                            onPress={() => handleCompleteTask(taskId, uid)}
                        >
                            <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={24} color="white" />
                            <Text style={globalStyles.ButtonText}> Finalizează</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={[globalStyles.Button, { flex: 1, backgroundColor: '#C03636', marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                            onPress={() => handleDeleteTask(taskId, uid)}
                        >
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color='white' />
                            <Text style={globalStyles.ButtonText}> Șterge</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Back button */}
                <TouchableOpacity style={styles.linkGoBack} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={16} color="#007BFF" />
                    <Text style={styles.goBackText}>Înapoi la pagina de task-uri</Text>
                </TouchableOpacity>
            </View >
            <Toast config={toastConfig} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginVertical: 8,
        // paddingHorizontal: 20,
        paddingVertical: 8,
    },
    taskDetails: {
        flex: 1,
        width: '100%',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // marginVertical: 4,
    },
    chip: {
        backgroundColor: '#60908C',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 4,
        marginTop: 4,
    },
    chipText: {
        color: 'white',
        fontSize: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    value: {
        fontSize: 16,
        // marginBottom: 8,
    },
    bottomButtonsRow: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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

export default TaskShowPage;