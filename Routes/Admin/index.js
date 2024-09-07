//import Controllers here
const {createProfile, signIn, logout } = require('../../Controllers/Admins/profile');
const Router = require('express').Router();
const {sendRegistrationLink} = require('../../Controllers/Admins/createAgency');

Router.post('/create-profile', createProfile);
Router.post('/sign-in', signIn);
Router.get('/logout',logout);
Router.post('/create-agency', sendRegistrationLink);

module.exports = Router;