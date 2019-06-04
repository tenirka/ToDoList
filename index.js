const express = require('express');
const path = require('path');
const mysql = require('mysql');

const api = express();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3000,
    user: "root",
    password: 'root',
    database: 'todo'
});

try {
    connection.connect();
} catch (e) {
    console.log('connection failed');
    console.log(e);
}

connection.end(function(err) {
    if (err) {
        return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
});


api.use('/public', express.static(__dirname + '/public'));

api.get("/", function(req, res) {
    return res.sendFile(path.resolve('public', 'index.html'));
});

api.listen(3000, () => {
    console.log('API up and running');
});