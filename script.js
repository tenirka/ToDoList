/*  adding a new task after button click  */
$(document).ready(function () {

    $('#addtoDo').click(function () {
        let taskText = $('#toDoName').val();
        const currentdate = new Date($.now());
        const datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + "  " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes();

        $('#todo-list').prepend(
            `<li>
                <input type = "checkbox">
                ${taskText} ${datetime}
            </li>`);
        const newTask = {
            id: +new Date(),
            taskText: taskText,
            date: new Date(),
            isActive: false
        }
        setDataToLC(newTask)
    });
    /*  add click on enter button  */
    $('#toDoName').keyup(function (event) {
        if (event.keyCode == 13) {
            $('#addtoDo').click();
        }
    });
})

function drawTaskListFromLC() {
    const taskItem = localStorage.getItem('array')
    drawTaskListFromLC();
}

const todos = [{
    'key': 'val'
    
}];
let str_arr = JSON.stringify(todos);
console.log('------------------------------------');
console.log(str_arr);
console.log('------------------------------------');
localStorage.setItem('array', str_arr)
const obj = {
    key: 'val1',
    name: '',
    date: '',
    isActive: false
}
//localStorage.setItem('array', retstr_arr)
let retstr_arr = JSON.parse(localStorage.getItem('array'));
retstr_arr.push(obj)

let otherCheckbox = 

function getDataFromLC() {
    return JSON.parse(localStorage.getItem('array') || '[]')
}

function setDataToLC(data) {
    const currentTaskList = getDataFromLC();
    currentTaskList.push(data)
    localStorage.setItem('array', JSON.stringify(currentTaskList))
}