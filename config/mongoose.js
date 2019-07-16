const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todo_app_dev', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, "Connection to DB Failed!"));

db.once('open', ()=>{
    console.log('Successfully Connected to Database!');
})