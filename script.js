const TODOS_KEY = 'todos';

let todos = [];
document.getElementById("todo-list").innerHTML = todos;

const input = document.getElementById("toDoName");

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
    removeItem(event.target.value);
    $(this).closest('li').remove();
});

$(document).on('click', '.all-del', function() {
    removeAllItems();
    $('#todo-list').empty();
});

$('#todo-list').on('click', '.checkBox', clickCheckBox)

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
                <input type = "checkbox" class="checkBox" ${todo.isActive ? 'checked':''}>
                ${todo.taskText} ${formatDate(todo.datetime)} 
                <button class = "delete"
                value = ${todo.id}> x </button>
        </li>`
    )
}



/**
 * 1) Get todos from LS
 * 2) todos.forEach(todo => drawTodo(todo))
 */

function initTodos() {
    todos = getTodosFromStorage();
    drawTodos(todos);
}

function drawTodos(todos) {
    $('#todo-list').empty()
    todos.forEach(todo => {
        return drawTodo(todo);
    });

}

/* draww todos in LS */

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

/* save todos to LS */

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

function clickCheckBox(event) {
    console.log('here check')
    const oldChecks = JSON.parse(localStorage.getItem(TODOS_KEY));
    let checkedTodo = {}
    const newTodos = oldChecks.filter(el => {
        if (el.id === +$(this).parent().attr('attr-id')) {
            el.isActive = !el.isActive
            checkedTodo = el
        }
        return el.id !== +$(this).parent().attr('attr-id')
    })    
    
    if (checkedTodo.isActive) {
        newTodos.push(checkedTodo);
    }
    else {
        newTodos.unshift(checkedTodo)
    }
    
    drawTodos(newTodos);
    
    let checkedItemIndex = oldChecks.findIndex(el => {
        return el.id == $(this).parent().attr('attr-id')
    })

    let checkedItem = oldChecks[checkedItemIndex];
    checkedItem.isActive = $(this).prop('checked');
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
    console.log('here done')
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

function finishDoneItems(id) {
        const oldTodos = JSON.parse(localStorage.getItem(TODOS_KEY));
        
}
