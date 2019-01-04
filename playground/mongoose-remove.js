var {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = '5c2e16a7a08f2f248474890e';

if(!ObjectID.isValid(id)){
    console.log('this id is not valid'); 
}
//we dont manually need to convert our string to objectID
//note using find() returns an array of objects, unlike findOne(), findById() which returns just the particular object of interest


//remove on todo
// Todo.findByIdAndDelete(id).then(todo => {
//     if(todo){
//         console.log('deleted todo is: ', todo)
//     }else{
//         console.log('could not find todo')
//     }
// }).catch(err => console.log('this is not even an id'));

//remove on todo
// Todo.findByIdAndRemove(id).then(todo => {
//     if(todo){
//         console.log('deleted todo is: ', todo)
//     }else{
//         console.log('could not find todo')
//     }
// }).catch(err => console.log('this is not even an id'));

//find one and remove
// Todo.findOneAndRemove({
//     _id: id
// }).then(todo => {
//     if(todo){
//         console.log('deleted todo is: ', todo)
//     }else{
//         console.log('could not find todo')
//     }
// }).catch(err => console.log('this is not even an id'));


//to remove everthing from the collection, we do:
// Todo.remove({}).then((result) => {
//     console.log(result)
// });

