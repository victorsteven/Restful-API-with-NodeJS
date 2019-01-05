var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var should = chai.should();
chai.use(chaiHttp);
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');

const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

//lets insert dummy data into the database:
// const todos = [
//     {
//         _id: new ObjectID(),
//         text: 'this is first'
//     },
//     {
//         _id: new ObjectID(),
//         text: 'this is second',
//         completed: true,
//         completedAt: 124
//     },
// ];
//lets make sure our database is empty, before we run each test:
// beforeEach(done => {
//     Todo.remove({}).then(() => {
//         //the return statement is necessary for the chainig of another then below
//         return Todo.insertMany(todos);
//     }).then(() => done());
// });
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', done => {
        var text = 'Tes todo test';
//remember the database is wiped for each test, so, when we insert our data, we should be getting one value back
        chai.request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                // console.log(res)

                expect(res.status).equal(200)
                expect(res.body.text).equal(text)

                Todo.find({text}).then(todos => {
                    expect(todos.length).equal(1);
                    expect(todos[0].text).equal(text);
                    done();
                }).catch(e => done(e));
            }); 
    });

    it('should not create a todo with invalid body data', done => {
        var text = '';
        chai.request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                expect(res.status).equal(400)

                Todo.find().then(todos => {
                    expect(todos.length).equal(2);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        chai.request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                expect(res.status).equal(200);
                Todo.find({_creator: users[0]._id}).then(todos => {
                    expect(todos.length).equal(1);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos/:id', () => {
    it('it should return a todo doc', done => {
        // var id = todos[1]._id.toHexString();
        var id = todos[1]._id;

        // console.log(id)
        chai.request(app)
            //since the id is an object, we convert it to a string. though, it will also work without conversion, because, it will be automatic
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .end((err, res) => {
                // console.log("this is it", res.body.todo)
                expect(res.status).equal(200);
                expect(res.body.todo.text).equal(todos[1].text);
                Todo.findById(id).then(oneTodo => {
                    // console.log('ONE TODO: ', oneTodo);
                    expect(oneTodo._id).deep.equal(id); //note id is an object, so we use deep equal
                    expect(oneTodo.text).equal('this is second');
                    done();
                }).catch(e => console.log(e));
            });
    });

    it('it should not return a todo doc created by another user', done => {
        // var id = todos[1]._id.toHexString();
        var id = todos[1]._id;

        // console.log(id)
        chai.request(app)
            //since the id is an object, we convert it to a string. though, it will also work without conversion, because, it will be automatic
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                expect(res.status).equal(404);
                done();
            });
    });

    it('should retuen 404 if todo is not found', done => {
        var id = new ObjectID();

        chai.request(app)
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .end((err, res) => {
                expect(res.status).equal(404);
                done();
            });
    })

    it('should retuen 400 for non-object ids', done => {
        var id = 2222222222222;

        chai.request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .end((err, res) => {
                expect(res.status).equal(400);
                done();
            });
    })
});

describe("Delete todos", () => {
    it('should delete a todo', done => {
        var id = todos[0]._id.toHexString();
        chai.request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(200);
                expect(res.body.todo.text).equal(todos[0].text);
                expect(res.body.todo._id).equal(id);

                //now, we have deleted the todo, so, when we find it in the database, it should not be there:
                Todo.findById(id).then(todo => {
                    expect(todo).to.not.exist;
                    done();
                }).catch(e => done(e))
            })
    });
    it('should delete a todo i did not own', done => {
        var id = todos[0]._id.toHexString();
        chai.request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(404);
                // expect(res.body.todo.text).equal(todos[0].text);
                // expect(res.body.todo._id).equal(id);

                //now, we have deleted the todo, so, when we find it in the database, it should not be there:
                Todo.findById(id).then(todo => {
                    expect(todo).to.exist;
                    done();
                }).catch(e => done(e))
            });
    });

    it('should return 404 if todo not found', done => {
        var id = new ObjectID();
        chai.request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                expect(res.status).equal(404);
                done();
            })
    });

    it('should return 400 if object id is invalid', done => {
        chai.request(app)
            .delete(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(400);

                done();
            });
    });
});

describe('UPDATE todos', () => {
    it('should update a todo when completed is false', done => {
        var id = todos[1]._id.toHexString();
        var body = {text: 'this is mine', completed: false};

        chai.request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(body)
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                expect(res.status).equal(200);
                // console.log(res.body.todo);
                expect(res.body.todo.text).equal('this is mine')
                Todo.findOne({_id: id, _creator: users[1]._id}).then(todo => {
                    // console.log(todo)
                    expect(todo.text).equal('this is mine');
                    expect(todo.completed).equal(false);
                    expect(todo.completedAt).is.null
                done();
                }).catch(e => console.log('we didnt find it. Period!'));
            });
    });

    it('should not update a todo when completed is false, that is owned by someone', done => {
        var id = todos[1]._id.toHexString();
        var body = {text: 'this is mine', completed: false};

        chai.request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                expect(res.status).equal(404);
                //the todo remains the same
                Todo.findOne({_id: id, _creator: users[1]._id}).then(todo => {
                    expect(todo.text).equal('this is second');
                    expect(todo.completed).equal(true);
                    expect(todo.completedAt).is.not.null
                done();
                }).catch(e => done(e));
            });
    });

    it('should update todo when completed is true', done => {
        var id = todos[0]._id.toHexString();
        // var body = { text: "this is you", completed: true }
        chai.request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            // .send(body)
            .send({
                text: "this is for you", 
                completed: true
            })
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                expect(res.status).equal(200);

                Todo.findById(id).then(todo => {
                    // console.log(todo);
                    expect(todo.text).equal('this is for you');
                    expect(todo.completed).equal(true)
                    expect(todo.completedAt).to.be.a('number')
                    done();
                }).catch(e => console.log('could not find todo'));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        chai.request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                expect(res.status).equal(200)
                expect(res.body._id).equal(users[0]._id.toHexString());
                expect(res.body.email).equal(users[0].email);
                done();
            });
    });

    it('should return 401 if not authenticated', done => {
        chai.request(app)
            .get('/users/me')
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(401);
                expect(res.body).is.empty
                expect(res.body).deep.equal({})

                done();
            });
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        let email = 'hope@gmail.com';
        let password = 'asskjjdwde';

        chai.request(app)
            .post('/users')
            .send({email, password})
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(200);
                expect(res.header['x-auth']).to.exist;
                expect(res.body.password).is.not.null;
                expect(res.body.email).equal(email)

                User.findOne({email}).then(user => {
                    expect(user).to.exist;
                    //since our password is hashed:
                    expect(user.password).not.equal(password);
                done();
                })
            });
    });

    it('should return validation errors if request invalid', done => {
        let email = 'hopegmail.com';
        let password = 'asskjjdwde';

        chai.request(app)
            .post('/users')
            .send({email, password})
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(400);

                done();
            });
    })

    it('should not create user if email in use', done => {
        var email = users[0].email;
        var password = 'idfnefnnfwe';
        chai.request(app)
            .post('/users')
            .send({email, password})
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(400)
                done();
            })
    });

});

describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        var email = users[1].email;
        var password = users[1].password;

        // var hashPassword = bcrypt.genSalt(10, (err, salt) => {
        //     bcrypt.hash(password, salt, (err, hash) => {
        //         return password = hash;
        //     });
        // });

        var body = {email: email, password: password}

        chai.request(app)
            .post('/users/login')
            .send(body)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(200);
                expect(res.header['x-auth']).not.null;

                User.findById(users[1]._id).then((user) => {
                    expect(user.email).equal(users[1].email)
                    expect(user.tokens[1]).to.include({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(e => done(e));
            });
    });


    it('should reject invalid login', done => {
        var email = users[1].email;
        var password = '432wsdssd';

        var body = {email: email, password: password}

        chai.request(app)
            .post('/users/login')
            .send(body)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(400);
                expect(res.header['x-auth']).not.exist;
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).equal(1);
                    done();
                }).catch(e => done(e));
            });
    });

});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', done =>{
        chai.request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                expect(res.status).equal(200);
                
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).equal(0)
                    done();
                }).catch(e => done(e))
            });            
    });
});