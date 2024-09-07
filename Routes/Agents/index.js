const {signIn, logout, createProfile} = require('../../Controllers/Agents/profile');
const { createOtp, verifyOtp, newPassword } = require('../../Controllers/Agents/resetpassword');

const Router = require('express').Router();

Router.post('/sign-in', signIn);
Router.post('/create-profile', createProfile);
Router.get('/logout',logout);
Router.post('/generate-otp',createOtp);
Router.post('/validate-otp',verifyOtp);
Router.post('/change-password', newPassword);

module.exports = Router;