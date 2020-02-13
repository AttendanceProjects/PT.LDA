const Route = require('express').Router(),
  { UserController: { signin, signup, checkSignin, changePassword, updatePin, updateImage, forgotPassword, confirmSecretCode, filterFindUser, allEmployee } } = require('../controllers'),
  { auth: { authentication, checkSecretCode, isMaster, isEmployee, isStaff } } = require('../middlewares')

Route.post('/signin', signin);
Route.post('/forgot', forgotPassword);
Route.post('/forgot/confirm', checkSecretCode, confirmSecretCode);

Route.use( authentication );
Route.get('/', checkSignin);
Route.get('/employee', authentication, isEmployee, allEmployee);
Route.post('/find', authentication, isEmployee, filterFindUser);
Route.post('/signup', isMaster, signup);
Route.post('/change', changePassword);
Route.put('/change/pin', isStaff, updatePin);
Route.post('/upload', updateImage);

module.exports = Route;