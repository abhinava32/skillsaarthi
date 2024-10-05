/***************************************************
 * This section is for logs by developers.
 *              Server File.
 *
 * Author: Abhinav Anand (Inital Release)
 ***************************************************/

/***********
 * Imports
 ***********/
require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { checkAuth } = require("./Middlewares/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");

/***************************************************************************************************************************** */
//                                              Middlewares
/***************************************************************************************************************************** */
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from React app
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    credentials: true, // Enable sending cookies or HTTP authentication headers
  })
);
app.use((req, res, next) => {
  console.log(`Received request at path: ${req.path}`);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", require("./Middlewares/aadharToken").aadharToken);
app.use("/", checkAuth, require("./Routes/index"));
/***************************************************************************************************************************** */

/***************************************************************************************************************************** */
//                                              Wrokers Invoking
/***************************************************************************************************************************** */
const { emailWorker } = require("./Workers/email-worker");
const { smsWorker } = require("./Workers/sms-worker");
/***************************************************************************************************************************** */

/***************************************************************************************************************************** */
//                                              Server Logic
/***************************************************************************************************************************** */
app.listen(port, (err) => {
  if (err) {
    if (process.env.ENVIRONMENT === "Development") {
      return console.log("Unable to start ");
    } else {
      return console.log("Error 500: Error Creating Server");
    }
  }
  if (process.env.ENVIRONMENT === "Development") {
    console.log("Server Started");
  }
});
/***************************************************************************************************************************** */
