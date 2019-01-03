// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) return console.log('unable to connect to database');
    console.log('connected to MongoDB server');

    //connect to the "Todos" database
    const mydb = db.db('TodoApp');
    
    // mydb.collection('Todos').deleteMany({text: 'Something to do'}).then(result => {
    //     console.log(result);
    // });

    // mydb.collection('Todos').deleteOne({text: 'do something'}).then(result => {
    //     console.log(result);
    // });

    //findOneAndDelete get the document back, the one we just deleted unlike others
    // mydb.collection('Todos').findOneAndDelete({text: 'do something'}).then(result => {
    //     console.log(result);
    // });

    mydb.collection('Users').findOneAndDelete({name: 'Steven Victor'}).then(result => console.log(result));
    // db.close();
});