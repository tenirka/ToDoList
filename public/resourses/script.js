const TODOS_KEY = 'todos';

let todos = [];
document.getElementById("todo-list").innerHTML = todos;

const input = document.getElementById("toDoName");

$(document).ready(function() {
    getAllTodos(drawTodos);

});

/* create new to do after clicking the button "Add" */

$('#addtoDo').click(function() {
    let taskText = $('#toDoName').val();
    const todo = createTodo(taskText);
    saveTodo(todo, drawTodo);
    input.value = "";
});


/*  add click on enter button  */

$('#toDoName').keyup(function(event) {
    if (event.keyCode == 13) {
        $('#addtoDo').click();
    };
});


/** add click on button:  
 * 1.delete 
 * 2.delete all 
 * 3.checkbox
 * 4.check all
 * 5.uncheck all
 * 6.show done tasks
 * 7.show all tasks
 * 8.show active tasks
 * 9.sort todo-list by name
 * 10.sort to-do list by datetime
 */

$('#todo-list').on('click', '.delete', function(event) {
    const id = ($(this).parent().attr('attr-id'))
    deleteTodoById(id, function() {
        $(this).closest('li').remove()
    });
});

$(document).on('click', '.all-del', function() {
    const id = ($(this).parent().attr('attr-id'));
    deleteAllItems(id, function() {
        $('#todo-list').empty();
    });
});

$('#todo-list').on('click', '.checked', function(event) {
    const id = ($(this).parent().parent().attr('attr-id'))
    clickCheckBox(id)
})

$('.check-all').on('click', showCheckedAll);

$('#uncheck').on('click', showAllUncheck);

$('#done').on('click', showDoneTasks(drawTodos));

$('#all').on('click', showAllTasks(drawTodos));

$('#active').on('click', showActiveTasks);

$('#getByName').on('click', sortItemsByName);

$('#getByDate').on('click', sortItemByDate);



/* draw todo in LS */

function drawTodo(todo) {
    $('#todo-list').append(
        `<li id=${todo.id} attr-id=${todo.id}>
        <input type="checkbox" class="check1" ${todo.isActive ? 'checked':''}>
        <label for="check1"><div class="checked"><i></i></div></label>
                ${todo.taskText} ${formatDate(todo.datetime)} 
                <button class = "delete"
                value = ${todo.id}> x </button>
        </li>`
    )
}


function drawTodos(newTodos) {
    $('#todo-list').empty();
    newTodos.forEach(todo => {
        return drawTodo(todo);
    });

}

/* draw todos in LS */

// function drawTaskListFromLS() {
//     const taskItem = localStorage.getItem('array');
// }


function createTodo(taskText) {
    return {
        taskText: taskText,
        datetime: new Date(),
        isActive: false
    }
}

/**
 * 
 * getAllTodos
 * createTodo
 * deleteTodoById
 * 
 */

function getAllTodos(callback) {

    $.ajax({
        method: "GET",
        url: 'http://localhost:3000/todo-list',
        success: (response) => {
            callback(response.list)
        },
        dataType: "json"
    });

}

function saveTodo(todo, callback) {

    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/todo-list',
        data: todo,
        success: (response) => {
            callback(response.item)
        },
        error: (err) => anError()

    });

}

function deleteTodoById(id, callback) {
    $.ajax({
        url: `http://localhost:3000/todo-list/${id}`,
        type: 'DELETE',
        success: (result) => {
            callback()
        },
        error: (err) => anError()

    });
}

function deleteAllItems(id, callback) {
    $.ajax({
        url: 'http://localhost:3000/todo-list',
        type: 'DELETE',
        success: (result) => {
            callback()
        },
        error: (err) => anError()
    });
}

function clickCheckBox(id, callback) {
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/todo-list/update/${id}`,
        data: id,
        success: 200,
        error: (err) => anError()

    });
}



function anError(status, errorMsg) {
    const errorDiv = $('.error').text("Статус: " + status + " Ошибка: " + errorMsg)
    errorDiv.show(10, function() {
        setTimeout(function() {
                errorDiv.hide(300);
            },
            5000);
    });
}


/* add date and time near the task */


function formatDate(_date) {
    const date = new Date(_date)
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${minutes};`
}

function showCheckedAll() {
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/todo-list/update/`,
        success: 200,
        error: (err) => anError()

    });
}

function showAllUncheck() {
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/todo-list/uncheck/`,
        success: 200,
        error: (err) => anError()

    });
}

function showDoneTasks(callback) {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3000/todo-list/checked',
        success: (response) => {
            callback(response.list)
        },
        dataType: "json"
    });

}

function showActiveTasks() {
    const todos = getTodosFromStorage()
    const activeTasks = todos.filter(el => {
        return el.isActive != true;
    });
    drawTodos(activeTasks);
}

function showAllTasks(callback) {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3000/todo-list',
        success: (response) => {
            callback(response.list)
        },
        dataType: "json"
    });
}


function sortItemsByName() {
    const todos = getTodosFromStorage()
    const nameItems = todos.sort((a, b) => {
        return a.taskText < b.taskText ? -1 : a.taskText > b.taskText ? 1 : 0
    })
    drawTodos(nameItems);
}

function sortItemByDate() {
    const todos = getTodosFromStorage()
    const datetimeItems = todos.sort((a, b) => {
        return a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0
    });
    drawTodos(datetimeItems);
}