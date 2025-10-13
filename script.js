// Selecting nodes;
let form = document.querySelector("#toDoForm");
let task = document.querySelector("#toDoInput");
let displayTask = document.querySelector("#toDoList");
let clearAllBtn = document.querySelector("#clearAllBtn");

// Function for creating new task and adding to ul;
function createAndAppend (text, completed){
    // For New Task
    let  newTask = document.createElement("li")
    newTask.textContent = text;
    newTask.dataset.toDoText = text;
    
    // For completion
    if(completed){
        newTask.classList.add('completed');
    }
    newTask.addEventListener('click', function(){
        newTask.classList.toggle('completed');
        updateStorage();
    })

    // For Editing
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';

    editBtn.addEventListener('click', function(event) {
        event.stopPropagation();

        const listItem = event.target.parentElement;
        const todoText = listItem.textContent.replace('EditDelete', '').trim();
        const inputField = document.createElement('input');

        inputField.type = 'text';
        inputField.value = todoText;
        
        listItem.replaceWith(inputField);
        inputField.focus();
    });

    // For Deletion
    let dltBtn = document.createElement('button');
    dltBtn.textContent = 'Delete';
    dltBtn.addEventListener('click', function(event){
        event.stopPropagation();
        event.target.parentElement.remove();
        updateStorage();
    })

    newTask.append(editBtn);
    newTask.append(dltBtn);
    displayTask.append(newTask);
    
}

// For Clearing all Todos;
clearAllBtn.addEventListener('click', function(){
    displayTask.innerHTML = "";
    localStorage.clear();
})

// Function for storing todos;
function storing (text){
    let userTask = JSON.parse(localStorage.getItem("userTask")) || [];
    userTask.push({
        text: text,
        completed: false
    });
    localStorage.setItem("userTask", JSON.stringify(userTask));
}

// Function for updating localstorage
function updateStorage (){
    let allTasks = document.querySelectorAll('#toDoList li');
    let updatedTasks = [];
    
    allTasks.forEach(function(item){
        let toDoText = item.dataset.toDoText
        updatedTasks.push({
            text: toDoText,
            completed: item.classList.contains('completed')
        })
    })
    localStorage.setItem('userTask', JSON.stringify(updatedTasks));
}

// For Loading existing todos
document.addEventListener("DOMContentLoaded", function(){
    let savedToDos = JSON.parse(localStorage.getItem("userTask")) || [];
    savedToDos.forEach(function(toDoTextObject){
        createAndAppend(toDoTextObject.text, toDoTextObject.completed);
    })
})

// Main Working
form.addEventListener("submit", function(dets){
    dets.preventDefault();
    let userTask = task.value;
    if(userTask  !== ""){
        createAndAppend(userTask, false);
        storing(userTask)
        task.value = "" ;
    }
})
