
var mongoose = require('mongoose');


//before we could have a collection that have different field names,
// with mongoose, we define a model for each collection and define a general schema for all document

//defining a Todo model:

//note the first argument is the name of the collection.
//e.g, 'Todo' will be 'todos', mongoose will do that
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    //lets add the user that created the todo:
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// var newTodo = new Todo({
//     text: 'Cook Dinner'
// });

//take note, mongoose does type casting, so beware of boolean, object, etc
// var newTodo = new Todo({
//     text: '   Chop Dinner  ',
// });

// newTodo.save().then(doc => {
//     console.log('saved todo', doc)
// }).catch(err => console.log('unable to save'));


module.exports = {
    Todo
}