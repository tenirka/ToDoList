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
        //  console.log(req.query)
        const queryObj = {}
        const { sort, direction, isActive } = req.query;
        if (sort && direction) {
            queryObj.order = [
                [sort, direction]
            ]
        }

        let list = {}
        if (isActive == 'all') {
            list = await db.todo_item.findAll(queryObj)
        } else {
            list = await db.todo_item.findAll(queryObj, {
                where: {
                    isActive: isActive
                }
            });
        }

        return res.json({ list })
    } catch (error) {

        return res.status(500).json({ message: error.message })
    }
})

// api.get('/todo-list/checked/', async(req, res) => {
//     try {
//         const { isActive } = req.params;
//         const list = await db.todo_item.findAll({ where: { isActive: isActive } });
//         return res.json({ list })
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({ message: error.message })
//     }
// })

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

api.put('/todo-list/update/', async(req, res) => {
    try {
        let id = req.body.id
        let item = {}
        if (id != -1) {
            const todoItem = await db.todo_item.findByPk(id)

            if (!todoItem) {
                return res.status(404).json({ message: 'Model not found' });
            }

            item = await todoItem.update({
                isActive: todoItem.isActive ? false : true
            });
        } else {
            item = await db.todo_item.update({ isActive: req.body.isActive }, { where: {} });
        }

        return res.json({ item })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

// api.put('/todo-list/update/:isActive', async(req, res) => {
//     try {
//         const { isActive } = req.params;
//         const item = await db.todo_item.update({ isActive: isActive }, { where: {} });
//         return res.json({ item })
//     } catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// });

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
    try {
        db.todo_item.destroy({
            where: {}
        })
        return res.json({ message: 'All items deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Oops' })
    }
})

// api.get('/todo-list/active', async(req, res) => {
//     try {
//         const list = await db.todo_item.findAll({ where: { isActive: false } });
//         return res.json({ list })
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({ message: error.message })
//     }
// })

api.get("/", function(req, res) {

    return res.sendFile(path.resolve('public', 'index.html'));
});

api.listen(3000, () => {
    console.log('API up and running');
});