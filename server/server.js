require('./config/config.js'); //we set the environment variable

var express = require('express');
var bodyParser = require('body-parser');
//bodyParser takes the string body(json) and turns it to a javascript object
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// const port = process.env.PORT  || 3000;
const port = process.env.PORT;



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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send('ID is not valid')
    }
    Todo.findByIdAndRemove(id).then(todo => {
        if(!todo){
            return res.status(404).send('could not find todo')
        }else{
            console.log('The deleted todo is: ', todo);
            res.send({todo});
        }
    }).catch(e => res.status(400).send("The todo dont exist"));
});

app.patch(`/todos/:id`, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send('ID is not valid')
    }

    //i only want to update the text and completed
    var body = _.pick(req.body, ['text', 'completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if(!todo){
           return res.status(404).send('cant find todo')
        }
        res.status(200).send({todo});
    }).catch(e => res.send(e));
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app}

