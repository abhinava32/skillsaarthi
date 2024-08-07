require('dotenv').config();
const port = process.env.PORT;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//DB CONNECTION
const {connect} = require('./Config/sequalize');
// connect();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/', require('./Routes/index'));

app.listen(port, (err)=> {
    if(err){
        if(process.env.ENVIRONMENT === "Development"){
           return console.log("Unable to start ");
        }
        else{
            return console.log("Error 500: Error Creating Server");
        }
        
    }
    if(process.env.ENVIRONMENT === "Development"){
        console.log("Server Started");
    }
})