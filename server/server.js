require('./config/config.js'); //we set the environment variable

var express = require('express');
var bodyParser = require('body-parser');
//bodyParser takes the string body(json) and turns it to a javascript object
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

// const port = process.env.PORT  || 3000;
const port = process.env.PORT;



app.use(bodyParser.json());

//we got the user from the authenticate middleware
app.post('/todos', authenticate, (req, res) => {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then(doc => {
        res.send(doc);

    }).catch(err => res.status(400).send(err))
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then(todos => {
        // console.log(todos)
        res.send({todos});
    }).catch(e => res.status(400).send(e));
})

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    console.log(req);
    if(!ObjectID.isValid(id)){
        return res.status(400).send('ID is not valid')
    }
    //we were using findById, but now, we use findByOne() to put the creator details:
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then(todo => {
        if(!todo){
            return res.status(404).send('No one here');
        }else{
            console.log(todo);
            //lets send the todo like an object:
            res.send({todo});
        }
    }).catch(e => res.status(400).send("Cant find that todo"));
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send('ID is not valid')
    }
    // Todo.findByIdAndRemove(id).then(todo => {
    Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then(todo => {
        if(!todo){
            return res.status(404).send('could not find todo')
        }else{
            console.log('The deleted todo is: ', todo);
            res.send({todo});
        }
    }).catch(e => res.status(400).send("The todo dont exist"));
});

app.patch(`/todos/:id`, authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(todo => {
        if(!todo){
           return res.status(404).send('cant find todo')
        }
        res.status(200).send({todo});
    }).catch(e => res.send(e));
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    let user = new User(body);

    // user.generateAuthToken()

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token => {
        //we define our custom header preceded by 'x'
        res.header('x-auth', token).send(user)
    })).catch(e => res.status(400).send(e));
    
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.createCredentials(body.email, body.password).then(user => {
        // res.send(user);
        //if the user credentials is valid, then generate and set the auth token
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });

    }).catch(e => res.status(400).send(e));
    // res.send(body)

});

app.delete('/users/me/token', authenticate, (req, res) => {
    //since the user is authenticated, we have him in our request object
    //we call a removeToken() method:
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(e => res.status(4000).send(e));

})

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app}

