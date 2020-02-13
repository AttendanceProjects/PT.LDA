const Route = require('express').Router(),
  { UserController: { signin, checkPin, signup, checkSignin, changePassword, updatePin, updateImage, forgotPassword, confirmSecretCode, filterFindUser, allEmployee } } = require('../controllers'),
  { auth: { authentication, checkSecretCode, isStaff, isMaster, isEmployee } } = require('../middlewares')

Route.post('/signin', signin); // *
Route.post('/forgot', forgotPassword); //*
Route.post('/forgot/confirm', checkSecretCode, confirmSecretCode); //*

Route.use( authentication );
Route.get('/', checkSignin); // *
Route.get('/employee', authentication, isEmployee, allEmployee); // *
Route.post('/find', authentication, isEmployee, filterFindUser); // *
Route.post('/signup', isMaster, signup); // *
Route.post('/change', changePassword); //*
Route.post('/upload', updateImage); //*
Route.put('/change/pin', isStaff, updatePin); //*
Route.get('/check', isStaff, checkPin)

module.exports = Route;