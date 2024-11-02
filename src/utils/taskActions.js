import { ref, remove, update } from 'firebase/database';
import { db } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';

// Complete task function
export const completeTask = async (taskId, uid, setTasks, tasks) => {
    try {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        console.log('Updating task:', taskId, 'for user:', uid);
        await update(taskRef, { isChecked: true });
        setTasks(prevTasks => 
            prevTasks.map(task =>
                task.id === taskId ? { ...task, isChecked: true } : task
            )
        );
        Toast.show({
            type: 'success',
            text1: 'Task-ul a fost finalizat cu succes!',
            visibilityTime: 2000, // 2 seconds
            topOffset: 20,
        });
        return true;
    } catch (error) {
        console.error('Error completing task: ', error);
        Toast.show({
            type: 'error',
            text1: 'Eroare la finalizarea task-ului!',
            visibilityTime: 5000, // 5 seconds
            topOffset: 20,
        });
        return false;
    }
};

// Delete task function
export const deleteTask = async (taskId, uid, setTasks) => {
    try {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        console.log('Deleting task:', taskId, 'for user:', uid);
        await remove(taskRef);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        Toast.show({
            type: 'success',
            text1: 'Task-ul a fost șters cu succes!',
            visibilityTime: 2000, // 2 seconds
            topOffset: 20,
        });
        return true;
    } catch (error) {
        console.error('Error deleting task: ', error);
        Toast.show({
            type: 'error',
            text1: 'Eroare la ștergerea task-ului!',
            visibilityTime: 5000, // 5 seconds
            topOffset: 20,
        });
        return false;
    }
};

// TODO Edit Task
export const editTask = async (taskId, uid, updatedTask) => {
    try {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        await update(taskRef, updatedTask);
        console.log('Task updated successfully');
    } catch (error) {
        console.error('Error updating task: ', error);
    }
};
