//import Controllers here
const { signIn, signUp, logout } = require('../../Controllers/Agencies/profile');

const Router = require('express').Router();

Router.post('/create-profile', signUp);
Router.post('/sign-in', signIn);
Router.get('/logout',logout);

module.exports = Router;