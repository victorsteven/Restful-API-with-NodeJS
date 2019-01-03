var {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = '5c2ddd6bcf218a1fb96a7b52';

if(!ObjectID.isValid(id)){
    console.log('this id is not valid'); 
}
//we dont manually need to convert our string to objectID
//note using find() returns an array of objects, unlike findOne(), findById() which returns just the particular object of interest

Todo.find({
    _id: id
}).then(todos => {
    // console.log('Todos', todos)
    if(todos[0]){
        console.log('Todo', todos)
    }else{
        console.log('could not find todo')
    }
}).catch(err => console.log('this is not even an id'));

Todo.findOne({
    _id: id
}).then(todo => {
    if(todo){
        console.log('Todo', todo)
    }else{
        console.log('could not find todo')
    }
}).catch(err => console.log('this is not even an id'));

Todo.findById(id).then(doc => {
    // console.log(doc)
    if(doc){
        console.log('Todo', doc)
    }else{
        console.log('could not find todo')
    }
}).catch(err => console.log('this is not even an id'));


var user_id = '5c2d774fc0ea06125f70302a2';

User.findById(user_id).then(user => {
    if(user){
        console.log('User is: ', user)
    }else{
        console.log('no user')
    }
}).catch(err => console.log('please check the info provided, because the id is not even correct'));

