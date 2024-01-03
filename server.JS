const express = require('express')
const app=express();
const path = require('path');
const bodyparser =require("body-parser")
const session = require("express-session")
const {v4:uuidv4}= require("uuid")
const db=require('./db/conn.js')
const nocache = require("nocache");
const logger = require('morgan')
const userRoute= require('./Routes/user.js')
const adminRoute= require('./Routes/admin.js')

const port= process.env.PORT || 3000;

db.connect();

app.use(logger('dev'))
app.use(nocache())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//static assets
app.use(express.static('public'));


//session
app.use(session({
    secret:uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:500000000000}
}))


//Router
app.use('/',userRoute)
app.use('/admin',adminRoute)


//error route
app.use((req, res, next) => {
    res.status(404)
    res.render('error/errorpage',{title:"Error Page"})
});


//server
app.listen(port,()=>
{
    console.log("Listening to the server on http://localhost:3000");
})   