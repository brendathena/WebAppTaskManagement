// Startup
document.addEventListener('DOMContentLoaded', (event) => {
    const savedName = localStorage.getItem('preferredName');
    if (savedName) {
        document.getElementById('greeting').textContent = `Hey there, ${savedName}!`;
    }

    loadTasks();
});

// Change name
function openNamePopUp() {
    document.getElementById('name-popup').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';
}

function saveName() {
    const nameInput = document.getElementById('name-input').value;
    if (nameInput) {
        localStorage.setItem('preferredName', nameInput);
        document.getElementById('greeting').textContent = `Hey there, ${nameInput}!`;
        document.getElementById('name-popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
}

// Keydown event listener
document.addEventListener('keydown', function(event) {
    const namePopup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');

    if (namePopup.style.display === 'flex') {
        if (event.key === 'Enter') {
            saveName();
        }
        if (event.key === 'Escape') {
            namePopup.style.display = 'none';
            overlay.style.display = 'none';
        }
    }
});

// Add Task Function
function addTask() {
    const taskInput = document.getElementById('input-task').value.trim();
    const priority = document.getElementById('priority-input').value;
    const taskLimit = 100;

    if (taskInput) {
        const truncatedTask = taskInput.length > taskLimit ? taskInput.substring(0, taskLimit) + '...' : taskInput;
        const taskDiv = createTaskElement(truncatedTask, priority);

        document.getElementById(priority.toLowerCase()).appendChild(taskDiv);
        saveTask(priority, truncatedTask); // Save task to local storage

        document.getElementById('input-task').value = ''; // Clear the input field
    }
}

// Create Task Element
function createTaskElement(task, priority) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.textContent = task;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('task-button');
    deleteButton.onclick = () => deleteTask(taskDiv, priority, task);

    taskDiv.appendChild(deleteButton);

    if (priority !== 'done') {
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.classList.add('task-button');
        doneButton.onclick = () => moveTaskToDone(taskDiv, priority, task);
        taskDiv.appendChild(doneButton);
    }

    return taskDiv;
}

// Save task to local storage
function saveTask(priority, task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (!tasks[priority]) {
        tasks[priority] = [];
    }
    tasks[priority].push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    for (const priority in tasks) {
        const taskList = tasks[priority];
        taskList.forEach(task => {
            const taskDiv = createTaskElement(task, priority);
            document.getElementById(priority.toLowerCase()).appendChild(taskDiv);
        });
    }
}

// Delete task
function deleteTask(taskDiv, priority, task) {
    taskDiv.remove();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (tasks[priority]) {
        tasks[priority] = tasks[priority].filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Move task to done
function moveTaskToDone(taskDiv, priority, task) {
    // Remove the task from its original location
    deleteTask(taskDiv, priority, task);

    // Create a new task element with the 'done' priority
    const doneTaskDiv = createTaskElement(task, 'done');

    // Find and remove the "Done" button from the done task
    const doneButton = Array.from(doneTaskDiv.getElementsByClassName('task-button')).find(button => button.textContent === 'Done');
    if (doneButton) {
        doneButton.remove();
    }

    // Create the "Undo" button
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.classList.add('task-button');
    undoButton.onclick = () => undoTask(doneTaskDiv, task, priority);

    // Append the "Undo" button to the done task
    doneTaskDiv.appendChild(undoButton);

    // Append the done task to the "done" section
    document.getElementById('done').appendChild(doneTaskDiv);

    // Save the task with 'done' priority to local storage
    saveTask('done', task);
}



function undoTask(doneTaskDiv, task, priority) {
    // Remove the task from the "Done" section
    doneTaskDiv.remove();

    // Recreate the task element with its original priority
    const taskDiv = createTaskElement(task, priority);

    // Append the task back to its original priority section
    document.getElementById(priority.toLowerCase()).appendChild(taskDiv);

    // Save the task with its original priority to local storage
    saveTask(priority, task);
}


// Add event listener to the Add Task button
document.getElementById('add-task').addEventListener('click', addTask);
