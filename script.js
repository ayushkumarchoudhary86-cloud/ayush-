// getting elements from HTML
let taskInput = document.getElementById("taskInput");
let addTaskButton = document.getElementById("addTaskButton");
let taskList = document.getElementById("taskList");
let emptyMessage = document.getElementById("emptyMessage");
let tasks = [];

function loadTasksFromStorage() {
    let storedData = localStorage.getItem("todoTasks");
    if (storedData != null) {
        tasks = JSON.parse(storedData);
    }
}

function saveTasksToStorage() {
    let convertedData = JSON.stringify(tasks);
    localStorage.setItem("todoTasks", convertedData);
}

function addNewTask() {
    let text = taskInput.value;

    if (text === "") {
        alert("Please write a task first.");
        return;
    }

    let taskObject = {
        id: Date.now(),
        name: text,
        completed: false
    };

    tasks.push(taskObject);
    taskInput.value = "";
    saveTasksToStorage();
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let li = document.createElement("li");
        let span = document.createElement("span");
        
        span.innerText = task.name;

        if (task.completed === true) {
            span.classList.add("completed");
        }

        span.onclick = function() {
            tasks[i].completed = !tasks[i].completed;
            saveTasksToStorage();
            displayTasks();
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("deleteButton");

        deleteBtn.onclick = function() {
            deleteTask(task.id);
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }
}

function deleteTask(id) {
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    saveTasksToStorage();
    displayTasks();
}

addTaskButton.addEventListener("click", function() {
    addNewTask();
});


loadTasksFromStorage();
displayTasks();
