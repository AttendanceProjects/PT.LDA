const Route = require('express').Router(),
  { UserController: { signin, signup, checkSignin, changePassword, updateImage, forgotPassword, confirmSecretCode, approval, allEmployee } } = require('../controllers'),
  { auth: { authentication, checkSecretCode, isMaster, isEmployee } } = require('../middlewares')

Route.post('/signin', signin);
Route.post('/forgot', forgotPassword);
Route.post('/forgot/confirm', checkSecretCode, confirmSecretCode);

Route.use( authentication );
Route.get('/', checkSignin);
Route.get('/approval', approval);
Route.get('/employee', authentication, isEmployee, allEmployee);
Route.post('/signup', isMaster, signup);
Route.post('/change', changePassword);
Route.post('/upload', updateImage);

module.exports = Route;