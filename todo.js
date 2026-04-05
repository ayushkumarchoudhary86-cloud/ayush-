const API_URL = 'http://localhost:5000/tasks';

// Initialization
document.addEventListener('DOMContentLoaded', fetchTasks);

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}

// Toggle Loading Spinner
function toggleLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// GET - Fetch Tasks
async function fetchTasks(searchQuery = '') {
    try {
        const url = searchQuery ? `${API_URL}?search=${searchQuery}` : API_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Server error');
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        showToast('Failed to load tasks. Is the server running?', 'error');
    }
}

// POST - Add Task
async function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
    if (!title) return showToast('Task title cannot be empty', 'error');

    toggleLoading(true);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error('Failed to add task');
        
        input.value = '';
        fetchTasks();
        showToast('Task added successfully');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        toggleLoading(false);
    }
}

// PUT - Toggle Completion Status
async function toggleTask(id, currentStatus) {
    toggleLoading(true);
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_completed: !currentStatus })
        });
        if (!response.ok) throw new Error('Failed to update task');
        fetchTasks();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        toggleLoading(false);
    }
}

// DELETE - Remove Task
async function deleteTask(id) {
    toggleLoading(true);
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete task');
        fetchTasks();
        showToast('Task deleted', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        toggleLoading(false);
    }
}

// SEARCH
function searchTasks() {
    const query = document.getElementById('searchInput').value;
    fetchTasks(query);
}

// Render HTML
function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.is_completed ? 'completed' : ''}" style="cursor:pointer;" onclick="toggleTask(${task.id}, ${task.is_completed})">
                ${task.title}
            </span>
            <button onclick="deleteTask(${task.id})" style="background: red;">X</button>
        `;
        list.appendChild(li);
    });
}
