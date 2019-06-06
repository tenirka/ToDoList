const TODOS_KEY = 'todos';

let todos = [];
document.getElementById("todo-list").innerHTML = todos;

const input = document.getElementById("toDoName");

$(document).ready(function() {
    getAllTodos(drawTodo);

});

/* create new to do after clicking the button "Add" */

$('#addtoDo').click(function() {
    let taskText = $('#toDoName').val();


    const todo = createTodo(taskText);
    delete todo.id
    saveTodo(todo, drawTodo)
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
    deleteTodoById(event.target.value);
    $(this).closest('li').remove();
});

$(document).on('click', '.all-del', function() {
    removeAllItems();
    $('#todo-list').empty();
});

$('#todo-list').on('click', '.checked', function(event) {
    const id = ($(this).parent().parent().attr('attr-id'))
    clickCheckBox(id)
})

$('.check-all').on('click', showCheckedAll)

$('#uncheck').on('click', showAllUncheck)

$('#done').on('click', showDoneTasks)

$('#all').on('click', showAllTasks)

$('#active').on('click', showActiveTasks)

$('#getByName').on('click', sortItemsByName)

$('#getByDate').on('click', sortItemByDate)



/* draw todo in LS */

function drawTodo(todo) {
    $('#todo-list').append(
        `<li attr-id=${todo.id}>
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

function drawTaskListFromLS() {
    const taskItem = localStorage.getItem('array');
}


function createTodo(taskText) {
    return {
        id: +new Date(),
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
        dataType: "json",
        success: (response) => {
            callback()
        }
    });

}

function saveTodo(todo, callback) {

    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/todo-list',
        data: todo,
        success: (response) => {
            callback(todo)
        },
        error: (err) => anError()

    });

}

function deleteTodoById(id, callback) {
    console.log(id)
    $.ajax({
        url: `http://localhost:3000/todo-list/${id}`,
        type: 'DELETE',
        success: (result) => {
            callback(todo)
        },
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




/* save todos to LS */

// function saveTodosToStorage(todos) {
//     const serializedTodos = JSON.stringify(todos);
//     localStorage.setItem(TODOS_KEY, serializedTodos);
// }

// function getTodosFromStorage() {
//     const todos = JSON.parse(localStorage.getItem(TODOS_KEY));
//     if (!todos) {
//         return [];
//     }
//     return todos;
// }

/* add date and time near the task */


function formatDate(_date) {
    const date = new Date(_date)
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${minutes};`
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


/* checkbox status on LS */

function clickCheckBox(id) {
    console.log('id', id)
    const oldChecks = JSON.parse(localStorage.getItem(TODOS_KEY));
    let checkedTodo = {}
    const newTodos = oldChecks.filter(el => {
        if (el.id === +id) {
            el.isActive = !el.isActive
            checkedTodo = el;
        }
        return el.id !== +id
    })
    if (checkedTodo.isActive) {
        newTodos.push(checkedTodo);
    } else {
        newTodos.unshift(checkedTodo)
    }
    drawTodos(newTodos);

    localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos));
}


/* add check all button and save changes to LS */

function showCheckedAll() {
    const notAllcheckedItems = JSON.parse(localStorage.getItem(TODOS_KEY));

    let allCheckedItems = notAllcheckedItems.map(el => {
        el.isActive = true;
        return el;

    });
    $(".checkBox").attr('checked', true);
    localStorage.setItem(TODOS_KEY, JSON.stringify(allCheckedItems));
}
/* add uncheck all button and save changes to LS */

function showAllUncheck() {
    const notAllUncheckedItems = JSON.parse(localStorage.getItem(TODOS_KEY));
    let allUncheckedItems = notAllUncheckedItems.map(el => {
        el.isActive = false;
        return el;
    });
    $(".checkBox").attr('checked', false);
    localStorage.setItem(TODOS_KEY, JSON.stringify(allUncheckedItems));
}


function showDoneTasks() {
    const todos = getTodosFromStorage()
    const doneTasks = todos.filter(el => {
        return el.isActive != false;
    });
    drawTodos(doneTasks);

}

function showActiveTasks() {
    const todos = getTodosFromStorage()
    const activeTasks = todos.filter(el => {
        return el.isActive != true;
    });
    drawTodos(activeTasks);
}

function showAllTasks() {
    const todos = getTodosFromStorage()
    drawTodos(todos);
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