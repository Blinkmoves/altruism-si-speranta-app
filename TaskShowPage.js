import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { auth } from './firebaseConfig';
import commonStyles from './styles';

// FIXME: TaskShowPage not working, infinitely loading

const TaskShowPage = ({ route }) => {
    const { taskId } = route.params;
    const [task, setTask] = useState(null);

    // Get user ID from Firebase Auth
    const uid = auth.currentUser.uid;

    useEffect(() => {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        const unsubscribe = onValue(taskRef, (snapshot) => {
            const data = snapshot.val();
            setTask(data);
        });

        return () => unsubscribe();
    }, [taskId]);

    if (!task) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#093A3E" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* IMPORTED FROM TASKS */}
            <TouchableOpacity onPress={() => navigateToTaskShowPage(item)}>
                <View>
                    <View style={styles.row}>
                        {/* Task Details */}
                        <View style={styles.taskDetails}>
                            <Text>{item.description}</Text>
                            {/* Tags */}
                            <View style={styles.chipContainer}>
                                {item.tags && item.tags.length > 0 ? (
                                    item.tags.map((tag, tagIndex) => (
                                        <View key={tagIndex} style={styles.chip}>
                                            <Text style={styles.chipText}>{tag}</Text>
                                        </View>
                                    ))
                                ) : null}
                            </View>
                            {/* Deadline and Responsible Person */}
                            <View style={styles.taskInfoRow}>
                                <Text style={styles.taskInfoText}>Deadline:
                                    <Text style={styles.taskResponsabil}> {formatDate(item.deadline)}</Text>
                                </Text>
                                <Text style={styles.taskInfoText}>Responsabil:
                                    <Text style={styles.taskResponsabil}> {item.responsiblePerson}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            {/* IMPORTED FROM TASKS */}
            <Text style={styles.title}>Task Details</Text>

            {/* Task Description */}
            <View style={styles.detailRow}>
                <Text style={styles.label}>Description: </Text>
                <Text style={styles.value}>{task.description}</Text>
            </View>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Tags: </Text>
                    {task.tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>{tag}</Text>
                    ))}
                </View>
            )}

            {/* Deadline */}
            <View style={styles.detailRow}>
                <Text style={styles.label}>Deadline: </Text>
                <Text style={styles.value}>{new Date(task.deadline).toLocaleDateString()}</Text>
            </View>

            {/* Responsible Person */}
            <View style={styles.detailRow}>
                <Text style={styles.label}>Responsible: </Text>
                <Text style={styles.value}>{task.responsiblePerson}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
    },
});

export default TaskShowPage;