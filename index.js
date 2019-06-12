const express = require('express');
const path = require('path');
const db = require('./models');
const api = express();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
api.use('/public', express.static(__dirname + '/public'));

api.get('/todo-list', async(req, res) => {
    try {

        const queryObj = {}
        const { sort, direction } = req.query;

        console.log('sort', sort)

        console.log('direction', direction)

        if (sort && direction) {
            queryObj.order = [
                [sort, direction]
            ]
        }

        const list = await db.todo_item.findAll(queryObj);

        return res.json({ list })
    } catch (error) {

        return res.status(500).json({ message: error.message })
    }
})

api.post('/todo-list/update/:id', urlencodedParser, async(req, res) => {
    try {
        const { id } = req.params

        const todoItem = await db.todo_item.findByPk(id)
        console.log(todoItem);

        if (!todoItem) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const item = await todoItem.update({
            isActive: todoItem.isActive ? false : true
        });
        return res.json({ item })
    } catch (error) {
        return res.status(500).json({ message: 'oops' })
    }
});


api.post('/todo-list', urlencodedParser, async(req, res) => {
    try {
        const payload = req.body;

        if (!payload.taskText) {
            return res.status(400).json({ message: 'Field taskText is missing' });
        }
        const item = await db.todo_item.create(payload);
        return res.json({ item })
    } catch (error) {
        return res.status(500).json({ message: 'oops' })
    }
});

api.post('/todo-list/update/', urlencodedParser, async(req, res) => {
    try {
        const item = await db.todo_item.update({ isActive: true }, { where: {} });
        return res.json({ item })
    } catch (error) {
        return res.status(500).json({ message: 'oops' })
    }
});

api.post('/todo-list/uncheck/', urlencodedParser, async(req, res) => {
    try {
        const item = await db.todo_item.update({ isActive: false }, { where: {} });
        return res.json({ item })
    } catch (error) {
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

api.delete('/todo-list', async(req, res) => {
    const { id } = req.params
    try {
        db.todo_item.destroy({
            where: {}
        })
        return res.json({ message: 'All items deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Oops' })
    }
})

api.get('/todo-list/checked', async(req, res) => {
    try {
        const list = await db.todo_item.findAll({ where: { isActive: true } });
        return res.json({ list })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
})

api.get('/todo-list/active', async(req, res) => {
    try {
        const list = await db.todo_item.findAll({ where: { isActive: false } });
        return res.json({ list })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
})


api.get("/", function(req, res) {

    return res.sendFile(path.resolve('public', 'index.html'));
});

api.listen(3000, () => {
    console.log('API up and running');
});