const mongoose = require('mongoose');
const dbUrl = require('./').dbUrl;
// mongodb://localhost/todo_app_dev
mongoose.connect(dbUrl, {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, "Connection to DB Failed!"));

db.once('open', ()=>{
    console.log('Successfully Connected to Database!');
})