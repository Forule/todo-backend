const express = require('express');

const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json())

const DATA_FILE = path.join(__dirname, 'todos.json');

function loadTodos() {

    try{

        if (!fs.existsSync(DATA_FILE)) return []
        const data = fs.readFileSync(DATA_FILE, 'utf-8')
        return JSON.parse(data)

    }catch (error){
        console.error("Fehler beim Laden", error)
        return []
    }

}

function saveTodos(data) {

    try{

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null,2))

    }catch(error){

        console.error("Fehler beim Speichern", error)

    }

}

let todos = loadTodos()

app.get('/todos', (req, res) =>{

    res.json(todos);

});

app.post('/todos', (req, res) => {
    const newTodo = req.body;
    todos.push(newTodo);
    saveTodos(todos)
    res.status(201).json(newTodo);
});

app.delete('/todos/:id', (req, res) => {

    const { id } = req.params;

    todos = todos.filter(t => String(t.id) !== id)
    saveTodos(todos)

    res.status(204).send()

})

app.patch('/todos/:id', (req, res) => {
    
    const { id } = req.params

    const todo = todos.find(t => String(t.id) === id)

    if (todo) {

        todo.completed = !todo.completed
        saveTodos(todos)
        res.json(todo)

    }else {
        res.status(404).json({ message: "Todo nicht gefunden" });
    }

})

const PORT = 3000;
app.listen(PORT, () => {

    console.log('Server ist wach! Er hoert auf localhost:3000')

})