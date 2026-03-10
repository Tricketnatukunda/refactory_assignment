const express = require('express')


function createApp() {
    const app = express()
    app.use(express.json());
    const todos = [];


    app.get('/todos', (req, res) => {
        res.json(todos);
    })


    app.post('/todos', (req, res) => {
        const newItem = {
            id: Date.now(),
            description: req.body.description,
            status: 'Planned'
        }
        todos.push(newItem)
        res.status(201).json(newItem)
    })



    return app;
}

module.exports = createApp
