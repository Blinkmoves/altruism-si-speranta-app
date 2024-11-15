import { ref, remove, update } from 'firebase/database';
import { db } from '../services/firebaseConfig';
import { showSuccessToast, showErrorToast } from '../utils/toastHelpers';

// Complete task function
export const completeTask = async (taskId, uid, setTasks, tasks) => {
    try {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        console.log('Updating task:', taskId, 'for user:', uid);
        await update(taskRef, { isCompleted: true });
        setTasks(prevTasks => 
            prevTasks.map(task =>
                task.id === taskId ? { ...task, isCompleted: true } : task
            )
        );
        showSuccessToast('Task-ul a fost finalizat cu succes!');
        return true;
    } catch (error) {
        console.error('Error completing task: ', error);
        showErrorToast('Eroare la finalizarea task-ului!');
        return false;
    }
};
// TODO add setDeleted to tasks and hide them from the list don't delete them from the database
// Delete task function
export const deleteTask = async (taskId, uid, setTasks) => {
    try {
        const taskRef = ref(db, `tasks/${uid}/${taskId}`);
        console.log('Deleting task:', taskId, 'for user:', uid);
        await remove(taskRef);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        showSuccessToast('Task-ul a fost șters cu succes!');
        return true;
    } catch (error) {
        console.error('Error deleting task: ', error);
        showErrorToast('Eroare la ștergerea task-ului!');
        return false;
    }
};

// Edit task function (used to navigate to edit page from swiping)
export const editTask = (taskId, uid, navigation) => {
    navigation.navigate('Task-uri', {
          screen: 'EditTaskPage',
          params: { taskId, uid },
      });
};
