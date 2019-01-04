var mongoose = require('mongoose');

//mongoose uses callback by default. but we want the javascript global promise
mongoose.Promise = global.Promise;
//unlike normal connect, where need to use callback to get our connected database work:
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
module.exports = {
    mongoose
}