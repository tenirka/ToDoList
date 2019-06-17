const express = require('express');
const path = require('path');
const db = require('./models');
const api = express();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: true });
api.use('/public', express.static(__dirname + '/public'));
api.use(urlencodedParser);

api.get('/todo-list', async(req, res) => {
    try {
        const queryObj = {}
        const { sort, direction, isActive } = req.query;
        let list = []
        if (sort && direction) {
            queryObj.order = [
                [sort, direction]
            ]
        }
        if (isActive != 'all') {
            queryObj.where = {
                isActive: isActive === 'true'
            }
        }
        list = await db.todo_item.findAll(queryObj)
        return res.json({ list })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

api.post('/todo-list', async(req, res) => {
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

api.put('/todo-list/update-all/', async(req, res) => {
    try {
        let item = await db.todo_item.update({ isActive: req.body.isActive }, { where: {} });

        return res.json({ item })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

api.put('/todo-list/update/:id', async(req, res) => {
    try {

        let { id } = req.params;
        const todoItem = await db.todo_item.findByPk(id)
        const item = await db.todo_item.update({ isActive: !todoItem.isActive }, { where: { id } });
        console.log(req.params)
        return res.json({ item })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

api.delete('/todo-list/', async(req, res) => {
    try {
        await db.todo_item.destroy({
            where: {}
        })
        return res.json({ message: 'Deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

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