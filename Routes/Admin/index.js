//import Controllers here
const {createProfile, signIn, logout } = require('../../Controllers/Admins/profile');
const Router = require('express').Router();

Router.post('/create-profile', createProfile);
Router.post('/sign-in', signIn);
Router.get('/logout',logout);

module.exports = Router;