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
    const id = ($(this).parent().attr('attr-id'));
    deleteTodoById(id, function() {
        $(`#${id}`).remove();
    });
});

$(document).on('click', '.all-del', function() {
    const id = ($(this).parent().attr('attr-id'));
    deleteAllItems(id, function() {
        $('#todo-list').empty();
    });
});

/*$('#todo-list').on('click', '.checked', function(event) {
    const id = $(this).parent().parent().attr('attr-id')
    const item = clickCheckBox(id, function(item) {
        const { isActive } = item;
        $(`#${id} input`).prop('checked', isActive)
    })
})*/


$('#todo-list').on('click', '.checked', function(event) {
    const id = $(this).parent().parent().attr('attr-id')
    const item = clickCheckBox(id, false, function(item) {
        const { isActive } = item
        $(`#${id} input`).prop('checked', isActive)
    })
})

$('.updateCheck-all').on('click', function() {
    let updating = true
    if ($(this).attr('id') == 'uncheck') {
        updating = false
    }
    clickCheckBox(-1, updating, function() {
        $("input:checkbox").prop('checked', updating);
    })
});

$('.checkStatus').on('click', function() {
    let updating = true
    if ($(this).attr('id') == 'active') {
        updating = false
    }
    clickCheckBox(updating, drawTodos);

});

$('#all').on('click', e => getAllTodos(drawTodos));

//$('#active').on('click', e => showActiveTasks(drawTodos));

$(function() {
    const buttons = $('#getByName, #getByDate, #getByChecked');
    buttons.click(function() {
        const current = $(this).val();
        $(this).val(current === 'ASC' ? 'DESC' : 'ASC')
        this.classList.toggle('rotate');
        let sort = 'taskText';
        if ($(this).attr('id') == 'getByDate') {
            sort = 'datetime'
        } else if ($(this).attr('id') == 'getByChecked') {
            sort = 'isActive'
        }

        buttons.not($(this)).removeClass('active').next();
        $(this).addClass('active').next();
        getAllTodos(drawTodos, { sort, direction: current });

    });

})

/* draw todo */

function drawTodo(todo) {
    $('#todo-list').append(
        `<li id=${todo.id} attr-id=${todo.id}>
        <input type="checkbox" class="check1" ${todo.isActive ? 'checked':''}>
        <label for="check1"><div class="checked"><i></i></div></label>
                <p>${todo.taskText} ${formatDate(todo.datetime)}</p>
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

function createTodo(taskText) {
    return {
        taskText: taskText,
        datetime: new Date(),
        isActive: false
    }
}

function formatDate(_date) {
    const date = new Date(_date)
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${minutes};`
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

function getAllTodos(callback, { sort, direction, isActive = 'all' } = {}) {

    $.ajax({
        method: "GET",
        data: { sort, direction, isActive },
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

function clickCheckBox(id, isActive, callback) {
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todo-list/update/`,
        data: { id, isActive },
        success: (response) => {
            callback(response.item)
        },
        error: (err) => anError()

    });
}

// function showCheckStatus(callback) {
//     $.ajax({
//         //data: isActive,
//         method: "GET",
//         url: `http://localhost:3000/todo-list/checked/`,
//         success: (response) => {
//             callback(response.list)
//         },
//         dataType: "json"
//     });
// };

// function showActiveTasks(callback) {
//     $.ajax({
//         method: "GET",
//         url: 'http://localhost:3000/todo-list/active',
//         success: (response) => {
//             callback(response.list)
//         },
//         dataType: "json"
//     });
// }

function doUpdateCheckAll(isActive, callback) {
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todo-list/update/${isActive}`,
        success: (response) => {
            callback(response.item)
        },
        error: (err) => anError()

    });
}