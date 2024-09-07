//import Controllers here
const { signIn, signUp, logout, register} = require('../../Controllers/Agencies/profile');
const {addItem} = require('../../Controllers/Agencies/cart');

const Router = require('express').Router();

Router.post('/create-profile', signUp);
Router.post('/sign-in', signIn);
Router.get('/logout',logout);
Router.get('/register',register);
Router.post('/add-to-cart',addItem)

module.exports = Router;