const express = require('express');
const path = require('path');
const port = 5000;
const db = require('./config/mongoose');
const app = express();
const Todo = require('./models/Todo');
const moment = require('moment');

app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.urlencoded({extended: false}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.locals.errors = null;

app.use((req, res, next)=>{
    app.locals.errors = app.locals.errors || null;
    app.locals.createTodoFormData = app.locals.createTodoFormData || null;
    next();
})
const categoryOrder = {
    personal: '0',
    school: '1',
    work: '2',
    other: '3'
}
const compDueDate = (a, b, asc=false) => {
    let da = moment(a.dueDate, "DD MMM, YYYY")
    let db = moment(b.dueDate, "DD MMM, YYYY")
    // console.log(da<db, da.calendar(), db.calendar())
    if(asc) return da < db ? -1 : 1;
    return da > db ? -1: 1;

}

const compStringProp = (a, b, asc=false, prop) => {
    let da = a[prop].toLowerCase();
    let db = b[prop].toLowerCase();
    console.log(da<db, da, db)
    if(asc) return da < db ? -1 : 1;
    return da > db ? -1: 1;
}

const groupByCategories = (a, b)=>{
    return categoryOrder[a.category] < categoryOrder[b.category] ? -1 : 1;
}

app.get('/', (req, res)=>{
    let sortFilters = req.query.sort
    let prop = req.query.prop
    if(['title', 'description', 'category'].indexOf(prop)<0) prop = 'title';
    console.log(sortFilters, prop);
    Todo.find({}, (err, data)=>{
        if(err){
            console.log(err);
            return;
        }
        let todos = [...data];
        switch(sortFilters){
            case 'oldest-first':
                todos.sort((a, b)=>compDueDate(a, b, true))
                break;
            case 'latest-first':
                todos.sort((a, b)=>compDueDate(a, b, false))
                break;
            case 'ascending':
                todos.sort((a, b)=>compStringProp(a, b, true, prop))
                break;
            case 'descending':
                todos.sort((a, b)=>compStringProp(a, b, false, prop))
                break;              
            case 'group-by-categories':
                todos.sort((a, b)=>groupByCategories(a, b))
                break;              
        }
        return res.render('home', {
            todos
        });
    })
});

app.post('/todos', (req, res)=>{
    // console.log(req.body);
    let todo = JSON.parse(req.body.todo);
    console.log(todo)
    Todo.create(todo, (err, data)=>{
        if(err){
            console.log("Error in creating todo", Object.keys(err));
            app.locals.errors = err.errors ? Object.keys(err.errors).map(item=>err.errors[item].message) : null;
            app.locals.createTodoFormData = todo;
            console.log(app.locals.errors, todo);
            return res.redirect('back');
        }
        return res.send('Success!');
    })
    // res.redirect('back');
})

app.delete('/todos', (req, res)=>{
    console.log(req.body);
    let ids = JSON.parse(req.body.ids)
    Todo.find({})
    .where('_id')
    .in(ids)
    .remove()
    .exec((err, data)=>{
        if(err){
            console.log('Error:', err);
            return;
        }
        console.log(data);
        return res.redirect(200, '/');
    });
})

app.listen(port, (err)=>{
    if(err){
        console.log("Error: ", err);
        return;
    }
    console.log("Server Running on Port", port);
});