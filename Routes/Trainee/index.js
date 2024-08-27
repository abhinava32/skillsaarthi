//import Controllers here
const {createProfile} = require('../../Controllers/Trainee/profile');

const Router = require('express').Router();

Router.post('/create-profile',createProfile);


module.exports = Router;