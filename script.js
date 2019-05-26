const TODOS_KEY = 'todos';

let todos = [];
document.getElementById("todo-list").innerHTML = todos;



$(document).ready(function () {
    initTodos();
    createTodo();

});



/* create new to do after clicking the button "Add" */

$('#addtoDo').click(function () {
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

$('#toDoName').keyup(function (event) {
    if (event.keyCode == 13) {
        $('#addtoDo').click();
    };
});

/* draw todo in LS */

function drawTodo(todo) {
    $('#todo-list').append(
        `<li attr-id=${todo.id}>
                <input type = "checkbox" class="checkBox">
                ${todo.taskText} ${formatDate(todo.datetime)} 
                <button class = "delete"
                value = ${todo.id}> x </button>
        </li>`
    )
}

/* add click on delete button */

$('#todo-list').on('click', '.delete', function (event) {
    removeItem(event.target.value);
    $(this).closest('li').remove();
});

$(document).on('click', '.all-del', function () {
    removeAllItems();
    $('#todo-list').empty();
});

// $('#todo-list :checkbox').change(function () {
//     if (this.checked) {

//     } else {

//     }
// });

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
    if (!todos) {
        return [];
    }
    return todos;
}

/* add date and time near the task */


function formatDate(_date) {
    const date = new Date(_date)
    console.log('------------------------------------');
    console.log(_date);
    console.log('------------------------------------');
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}/${date.getHours()}:${date.getMinutes()};`
}

/* delete todo item from LS */

function removeItem(id) {
    const oldTodos = JSON.parse(localStorage.getItem(TODOS_KEY));
    const newTodos = oldTodos.filter(el => {
        return el.id !== +id
    })
    localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos));
}

function removeAllItems() {
    localStorage.setItem(TODOS_KEY, JSON.stringify([]));
    return
}


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

// })