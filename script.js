// Selecting nodes;
let form = document.querySelector("#toDoForm");
let task = document.querySelector("#toDoInput");
let displayTask = document.querySelector("#toDoList");
let clearAllBtn = document.querySelector("#clearAllBtn");

// Function for creating new task and adding to ul;
function createAndAppend(text, completed) {
    let newTask = document.createElement("li");
    newTask.textContent = text;
    newTask.dataset.toDoText = text;

    if (completed) {
        newTask.classList.add('completed');
    }
    
    // Main click listener for toggling 'completed' state
    newTask.addEventListener('click', function(event) {
        if (event.target === newTask) {
            newTask.classList.toggle('completed');
            updateStorage();
        }
    });

    // For Editing
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        let listItem = event.target.parentElement;
        let originalText = listItem.dataset.toDoText;
        let isCompleted = listItem.classList.contains('completed');
        
        let inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = originalText;
        
        listItem.replaceWith(inputField);
        inputField.focus();

        const finishEditing = () => {
            let newText = inputField.value.trim();
            // Check if the input field is still in the document before proceeding
            if (!document.body.contains(inputField)) {
                return; 
            }

            // Remove the old list item
            inputField.remove();
            
            if (newText !== "") {
                // Create a new list item with the updated text
                createAndAppend(newText, isCompleted);
            }
            
            updateStorage(); // Save the final state
        };
        
        inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                finishEditing();
            }
        });
        
        inputField.addEventListener('blur', function() {
            finishEditing();
        });
    });

    // For Deletion
    let dltBtn = document.createElement('button');
    dltBtn.textContent = 'Delete';
    dltBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        event.target.parentElement.remove();
        updateStorage();
    });

    // Append buttons
    newTask.append(editBtn);
    newTask.append(dltBtn);
    displayTask.append(newTask);
}

// For Clearing all Todos;
clearAllBtn.addEventListener('click', function() {
    displayTask.innerHTML = "";
    localStorage.clear();
});

// Function for updating localstorage
function updateStorage() {
    let allTasks = document.querySelectorAll('#toDoList li');
    let updatedTasks = [];
    
    allTasks.forEach(function(item) {
        let toDoText = item.dataset.toDoText;
        if (toDoText) {
            updatedTasks.push({
                text: toDoText,
                completed: item.classList.contains('completed')
            });
        }
    });
    localStorage.setItem('userTask', JSON.stringify(updatedTasks));
}

// For Loading existing todos
document.addEventListener("DOMContentLoaded", function() {
    let savedToDos = JSON.parse(localStorage.getItem("userTask")) || [];
    savedToDos.forEach(function(toDoTextObject) {
        createAndAppend(toDoTextObject.text, toDoTextObject.completed);
    });
});

// Main Working
form.addEventListener("submit", function(dets) {
    dets.preventDefault();
    let userTask = task.value.trim();
    if (userTask !== "") {
        createAndAppend(userTask, false);
        updateStorage();
        task.value = "";
    }
});