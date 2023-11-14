class Task {
    constructor(text, important, deadlines) {
        this.text = text;
        this.important = important;
        this.deadlines = deadlines;
        this.isDone = false;
    }
}

let dataService = {
    tasks: [],

    get allTasks() {
        return this.tasks;
    },

    get notCompletedTasks() {
        return this.tasks.filter(task => task.isDone == false);
    },

    add(task) {
        this.tasks.push(task);
        this.save();
    },

    delete(task) {
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);
        this.save();
    },

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    open() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }
}

class TasksListView {
    element;
    dataService;

    constructor(element) {
        this.element = element;
        dataService = dataService;
    }

    #drawList(tasksElements) {
        this.element.innerHTML = "";

        tasksElements.forEach(taskElement => {
            taskElement.createIn(this.element);
        })
    }

    drawAll() {
        let taskElements = [];

        let tasks = dataService.allTasks;
        if(tasks.length == 0) return;

        tasks.forEach(task => {
            taskElements.push(new TaskView(task));
        });
        this.#drawList(taskElements);
    }

    drawNotCompleted() {
        let taskElements = [];
        let tasks = dataService.notCompletedTasks;
        if(tasks.length == 0) return;

        tasks.forEach(task => {
            taskElements.push(new TaskView(task));
        });
        this.#drawList(taskElements)
    }
}

class TaskView {
    constructor(task) {
        this.task = task;
        this.div = null;
    }

    createIn(element) {
        this.div = document.createElement("div");
        this.div.classList.add("task");

        let input = document.createElement("input");
        input.addEventListener("click", this.changeState.bind(this));
        input.type = "checkbox";

        let taskNameTitle = document.createElement("p");
        taskNameTitle.textContent = "Task name: ";
        let taskName = document.createElement("h3");
        let importantTitle = document.createElement("p");
        importantTitle.textContent = "Importance: ";
        let important = document.createElement("h3");
        let deadlinesTitle = document.createElement("p");
        deadlinesTitle.textContent = "Deadlines (in days): ";
        let deadlines = document.createElement("h3");

        taskName.classList.add("task-name");
        important.classList.add("important-line");
        deadlines.classList.add("deadlines-line");

        taskName.innerText = this.task.text;
        
        this.task.important == true ? important.innerText = "Important" : important.innerText = "Non-important";
        this.task.important == true ? this.div.classList.add("serious") : this.div.classList.add("non-serious");
        // important.innerText = this.task.important;

        deadlines.innerText = this.task.deadlines;

        let button = document.createElement("button");
        button.classList.add("delete-task-button");
        button.innerHTML = "Delete task";
        button.addEventListener("click", this.delete.bind(this));

        this.div.appendChild(input);
        this.div.appendChild(taskNameTitle);
        this.div.appendChild(taskName);
        this.div.appendChild(importantTitle);
        this.div.appendChild(important);
        this.div.appendChild(deadlinesTitle);
        this.div.appendChild(deadlines);
        this.div.appendChild(button);

        if(this.task.isDone) {
            this.div.classList.add("completed");
            input.checked = true;
        }
        element.appendChild(this.div);
    }

    changeState(element) {
        this.task.isDone = !this.task.isDone;
        dataService.save();
        this.div.classList.toggle("completed");
    }

    delete() {
        dataService.delete(this.task);
        this.div.remove();
        checkDisplayStartMessage();
    }
}

let taskNameInput = document.querySelector("#task-name-input");
let addTaskButton = document.querySelector("#create-task-button");
let inputYes = document.querySelector("#yes-box");
let inputNo = document.querySelector("#no-box");
let deadlineDaysInput = document.querySelector("#deadlineDays");
let taskList = document.querySelector(".task-list");
let noTasksMess = document.querySelector(".no-tasks-title");


dataService.open();
let tasksListView = new TasksListView(taskList);

addTaskButton.addEventListener("click", addTaskHandler);


window.addEventListener("load", function() {
    tasksListView.drawAll();
    checkDisplayStartMessage();
});

taskNameInput.addEventListener("keydown", function(e) {
    if(e.code == "Enter") addTaskHandler();
});

function addTaskHandler() {
    if(taskNameInput.value) {
        let newTask = new Task(taskNameInput.value, inputYes.checked, deadlineDaysInput.value);
        dataService.add(newTask);
        tasksListView.drawAll();

        taskNameInput.value = "";
        checkDisplayStartMessage();
    } else {
        alert("Enter task name!")
    }
}

function checkDisplayStartMessage() {
    if(dataService.allTasks.length === 0) {
        noTasksMess.style.display = 'block';
    } else {
        noTasksMess.style.display = 'none';
    }
}

