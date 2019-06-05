const express = require('express');
const path = require('path');
const db = require('./models');
const api = express();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
api.use('/public', express.static(__dirname + '/public'));

api.get('/todo-list', async(req, res) => {
    try {
        const list = await db.todo_item.findAll({})
        console.log(list);
        return res.json({ list })
    } catch (error) {
        return res.status(500).json({ message: 'Oops' })
    }
})

api.post('/todo-list', urlencodedParser, (req, res, next) => {
    try {
        const tasks = req.body.todo_items();
        console.log(tasks);
        return res.send({ tasks })
    } catch (error) {
        return res.status(500).json({ message: 'Oops' })
    }


    // console.log(req.body);
    // return res.send({ todo_item: req.body });
});

api.get("/", function(req, res) {

    return res.sendFile(path.resolve('public', 'index.html'));
});

// api.delete('/todo-list', todo_item.id, (req, res) => {
//     if (err) { console.log(err) };

//     console.log(req.body);
//     return res.send({ todo_item: req.body })
// })

api.listen(3000, () => {
    console.log('API up and running');
});