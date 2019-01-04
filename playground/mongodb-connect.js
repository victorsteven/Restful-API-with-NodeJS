// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: "John", age: 23}
// var {name} = user;
// console.log(name);

//note, without the callback, we dont have access to the database.
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) return console.log('unable to connect to database');
    console.log('connected to MongoDB server');

    //connect to the "Todos" database
    const mydb = db.db('TodoApp');

    mydb.collection('Todos').insertOne({
        text: 'Something to do',
        completed: true
    }, (err, result) => {
        if(err){
            return console.log('unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    // mydb.collection('Users').insertOne({
    //     name: 'Steven Victor',
    //     age: 50,
    //     location: 'Lagos'
    // }, (err, result) => {
    //     if(err){
    //         return console.log('unable to insert todo', err);
    //     }
    //     //result.ops is an array of objects of the all the documents(rows) that got inserted
    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));

    // });
    // db.close();
});