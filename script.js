const TODOS_KEY = 'todos';

let todos = [];
document.getElementById("todo-list").innerHTML = todos;


$(document).ready(function() {
    initTodos();
    createTodo(taskText);
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

    /* add date and time near the task */

    const currentdate = new Date($.now());
    const datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + "  " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes();

});

/*  add click on enter button  */
$('#toDoName').keyup(function(event) {
    if (event.keyCode == 13) {
        $('#addtoDo').click();
    };
});


function drawTodo(todo) {
    //todo.taskText, todo.datetime 
    $('#todo-list').append(
        `<li>
                <input type = "checkbox" id="stat">
                ${taskText} ${datetime}
        </li>`
    )
}

function drawTodos(todos) {
    todos.forEach(todo => {
        return drawTodo(todo);
    });

}


/**
 * 1) Get todos from LS
 * 2) todos.forEach(todo => drawTodo(todo))
 */

function initTodos() {

    todos = getTodosFromStorage();
    drawTodos(todos);
}


function drawTaskListFromLS() {
    const taskItem = localStorage.getItem('array');
}


function createTodo(taskText) {
    return {
        id: +new Date(),
        taskText: taskText,
        date: new Date(),
        isActive: false,

    }
}


function saveTodosToStorage(todos) {
    const serializedTodos = JSON.stringify(todos);
    localStorage.setItem(TODOS_KEY, serializedTodos);
}

function getTodosFromStorage() {
    const todos = JSON.parse(localStorage.getItem(TODOS_KEY));
    if (!todos) { return []; }
    return todos;
}


/**
 * написала таск
 * добавила
 * создала объект туду
 * добавила в массив
 * записала в ЛС
 * сохранила в ЛС
 * перезагрузила страницу
 * таски на месте - отрисовка из ЛС
 */

/** для пустой страницы
 * открыла страницу
 * вижу только поле для ввода таска(??)
 * потому что ЛС выводит пустой массив
 */