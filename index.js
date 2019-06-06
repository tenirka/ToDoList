const express = require('express');
const path = require('path');
const db = require('./models');
const api = express();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
api.use('/public', express.static(__dirname + '/public'));

api.get('/todo-list', async(req, res) => {
    try {
        const list = await db.todo_item.findAll({});
        console.log(list);
        return res.json({ list })
    } catch (error) {
        return res.status(500).json({ message: 'Oops' })
    }
})

api.post('/todo-list', urlencodedParser, async(req, res) => {
    try {
        console.log(req.body)
        const payload = req.body;

        if (!payload.taskText) {
            console.log(payload.taskText)
            return res.status(400).json({ message: 'Field taskText is missing' });
        }
        console.log('payload', payload)
        console.log('body', req.body)
        const catalog = await db.todo_item.create(payload);
        console.log("CATALOG ", catalog);
        return res.send({ catalog })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'oops' })
    }
});

api.delete('/todo-list/:id', async(req, res) => {
    const { id } = req.params
    try {
        const todoItem = await db.todo_item.findByPk(id)
        if (!todoItem) {
            return res.status(404).json({ message: 'Model not found' });
        }
        await todoItem.destroy()
        return res.json({ message: 'Model deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Oops' })
    }
})

api.get("/", function(req, res) {

    return res.sendFile(path.resolve('public', 'index.html'));
});

api.listen(3000, () => {
    console.log('API up and running');
});