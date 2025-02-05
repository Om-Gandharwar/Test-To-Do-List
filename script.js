document.addEventListener('DOMContentLoaded', () => {
    const modeBtn = document.getElementById('modeBtn');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const newTaskInput = document.getElementById('newTask');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');

    // Dark mode toggle
    modeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        modeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    // Load dark mode state
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        modeBtn.textContent = '☀️ Light Mode';
    }

    // Fetch and display tasks from the server
    function fetchTasks() {
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${task.title} (${task.date} ${task.time})</span>
                        <button class="delete" data-id="${task.id}">🗑️</button>
                    `;
                    taskList.appendChild(li);
                });
            });
    }

    fetchTasks(); // Load tasks on page load

    // Add task
    addBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTime = taskTimeInput.value;

        if (!taskText) return alert('Task cannot be empty!');

        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskText, date: taskDate, time: taskTime })
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks(); // Refresh task list
            newTaskInput.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = '';
        });
    });

    // Delete task
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete')) {
            const taskId = event.target.getAttribute('data-id');
            fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(() => fetchTasks()); // Refresh task list
        }
    });
});
