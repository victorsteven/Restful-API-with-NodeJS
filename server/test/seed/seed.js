const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user');


//lets insert dummy data into the database:

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'example@example.com',
    password: 'password',

    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]

},{
    _id: userTwoId,
    email: 'example2@example2.com',
    password: 'password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [
    {
        _id: new ObjectID(),
        text: 'this is first',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'this is second',
        completed: true,
        completedAt: 124,
        _creator: userTwoId
    },
];

let populateTodos = done => {
    Todo.remove({}).then(() => {
        //the return statement is necessary for the chainig of another then below
        return Todo.insertMany(todos);
    }).then(() => done());
}

let populateUsers = done => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        //resolve all the promises:
        // Promise.all([userOne, userTwo]).then(() => {})
        //or:
        return Promise.all([userOne, userTwo])
    }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers}