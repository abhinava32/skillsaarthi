/***************************************************
 * This section is for logs by developers. 
 *              Server File.
 * 
 * Author: Abhinav Anand (Inital Release)
 */


require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { checkAuth } = require('./Middlewares/auth');
const cookieParser = require('cookie-parser'); 

/***************************************************************************************************************************** */
//                                              Middlewares 
/***************************************************************************************************************************** */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', require('./Middlewares/aadharToken').aadharToken);
app.use('/', checkAuth ,require('./Routes/index'));
/***************************************************************************************************************************** */



/***************************************************************************************************************************** */
//                                              Wrokers Invoking
/***************************************************************************************************************************** */
const {emailWorker} = require('./Workers/email-worker');
const {smsWorker} = require('./Workers/sms-worker');
/***************************************************************************************************************************** */



/***************************************************************************************************************************** */
//                                              Server Logic
/***************************************************************************************************************************** */
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
/***************************************************************************************************************************** */
