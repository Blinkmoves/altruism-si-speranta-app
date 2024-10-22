import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';
import commonStyles from './styles';

const TaskShowPage = ({ route }) => {
    const { taskId } = route.params;
    const [task, setTask] = useState(null);

    useEffect(() => {
        const taskRef = ref(db, `tasks/${taskId}`);
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
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Task Details</Text>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{task.description}</Text>
            <Text style={styles.label}>Tags:</Text>
            <Text style={styles.value}>{task.tags.join(', ')}</Text>
            <Text style={styles.label}>Deadline:</Text>
            <Text style={styles.value}>{new Date(task.deadline).toLocaleDateString()}</Text>
            <Text style={styles.label}>Responsible Person:</Text>
            <Text style={styles.value}>{task.responsiblePerson}</Text>
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