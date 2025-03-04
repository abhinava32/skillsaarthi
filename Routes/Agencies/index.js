//import Controllers here
const {
  signIn,
  signUp,
  logout,
  register,
} = require("../../Controllers/Agencies/profile");
const {
  addItem,
  getItems,
  deleteItem,
} = require("../../Controllers/Agencies/cart");
const { getTraineeList } = require("../../Controllers/Agencies/candidates");
const {
  createOtpPhone,
  createOtpEmail,
  verifyOtp,
  newPassword,
} = require("../../Controllers/Agencies/resetpassword");
const Router = require("express").Router();

Router.post("/create-profile", signUp);
Router.post("/reset-password", newPassword);
Router.post("/sign-in", signIn);
Router.get("/logout", logout);
Router.get("/register", register);
Router.post("/add-to-cart", addItem);
Router.post("/delete-from-cart", deleteItem);
Router.get("/get-cart", getItems);
Router.get("/send-otp-email/:email", createOtpEmail);
Router.get("/send-otp-phone/:phone", createOtpPhone);
Router.get("/get-candidates", getTraineeList);

module.exports = Router;
