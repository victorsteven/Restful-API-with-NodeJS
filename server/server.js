var express = require('express');
var bodyParser = require('body-parser');
//bodyParser takes the string body(json) and turns it to a javascript object
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT  || 3000;


app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then(doc => {
        res.send(doc);

    }).catch(err => res.status(400).send(err))
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        console.log(todos)
        res.send({todos});
    }).catch(e => res.status(400).send(e));
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send('ID is not valid')
    }
    Todo.findById(id).then(todo => {
        if(!todo){
            return res.status(404).send('No one here');
        }else{
            console.log(todo);
            //lets send the todo like an object:
            res.send({todo});
        }
    }).catch(e => res.status(400).send("Cant find that todo"));
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app}

