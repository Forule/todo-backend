const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

let todos = ["Bier", "Lernen"]

app.get('/todos', (req, res) =>{

    res.json(todos);

});

const PORT = 3000;
app.listen(PORT, () => {

    console.log('Server ist wach! Er hoert auf localhost:3000')

})