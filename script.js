const TODOS_KEY = 'todos';

let todos = [];
document.getElementById("todo-list").innerHTML = todos;



$(document).ready(function() {
    initTodos();
    createTodo();

});



/* create new to do after clicking the button "Add" */

$('#addtoDo').click(function() {
    let taskText = $('#toDoName').val();

    /**
     * 1) Create todo object 
     * 2) Put this obj to todos 
     * 3) Save todos to LS 
     * 4) Draw todo 
     */

    const todo = createTodo(taskText);
    todos.push(todo);
    saveTodosToStorage(todos);
    drawTodo(todo);

});


/*  add click on enter button  */

$('#toDoName').keyup(function(event) {
    if (event.keyCode == 13) {
        $('#addtoDo').click();
    };
});

/* draw todo in LS */

function drawTodo(todo) {
    console.log('------------------------------------');
    console.log(todos);
    console.log('------------------------------------');

    $('#todo-list').append(
        `<li attr-id=${todo.id}>
                <input type = "checkbox" class="checkBox">
                ${todo.taskText} ${formatDate(todo.date)} 
                <button class="delete">x</button>
        </li>`
    )
}

/* add click on delete button */

$('#todo-list').on('click', '.delete', function() {
    $(this).closest('li').remove();
});

$(document).on('click', '.all-del', function() {
    $('#todo-list').closest('li').remove();

});


/**
 * 1) Get todos from LS
 * 2) todos.forEach(todo => drawTodo(todo))
 */


function initTodos() {

    todos = getTodosFromStorage();
    drawTodos(todos);
}

function drawTodos(todos) {
    todos.forEach(todo => {
        return drawTodo(todo);
    });

}

function drawTaskListFromLS() {
    const taskItem = localStorage.getItem('array');
}


function createTodo(taskText) {
    return {
        id: +new Date(),
        taskText: taskText,
        datetime: new Date(),
        isActive: false,
    }
}

/* save tods to LS */

function saveTodosToStorage(todos) {
    const serializedTodos = JSON.stringify(todos);
    localStorage.setItem(TODOS_KEY, serializedTodos);
}

function getTodosFromStorage() {
    const todos = JSON.parse(localStorage.getItem(TODOS_KEY));
    if (!todos) { return []; }
    return todos;
}

/* add date and time near the task */


function formatDate(_date) {
    const date = new Date(_date)
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}/${date.getHours()}:${date.getMinutes()};`
}

/* delete todo item from LS */




function removeItem() {
    const todos = JSON.parse(localStorage.getItem(TODOS_KEY));

    todos.splice(index, 1);
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));

}

const found = todos.find(function(removeItem) {
    if (todos.indexOf) {
        return todos.indexOf(value);
    }

    for (var i = 0; i < todos.length; i++) {
        if (todos[i] === value) return i;
    }

    return -1;
});


/* checkbox status */

// $('#checkBox').click(function(todo) {
//     if (todo.isActive.checked) {
//         localStorage.checked = true;
//     } else {
//         localStorage.checked = false;
//     }

// });


// function save() {
//     var checkbox = document.getElementByClassName("checkBox");
//     localStorage.setItem("checkBox", checkbox.checked);
// }

// //for loading

// let checked = JSON.parse(localStorage.getItem("checkBox"));
// document.getElementByClassName("checkBox").checked = checked;

// $(document).ready(function() {

//     document.querySelector('#checkBox').checked = localStorage.checked

// });