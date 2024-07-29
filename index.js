require('dotenv').config();
const port = process.env.PORT;

const express = require('express');
const app = express();

const server = app.listen(port, (err)=> {
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