const Route = require('express').Router(),
  { UserController } = require('../controllers'),
  { signin, signup, checkSignin, changePassword, forgotPassword, confirmSecretCode, approval } = UserController,
  { auth } = require('../middlewares'),
  { authentication, checkSecretCode, isMaster } = auth

Route.get('/', authentication, checkSignin);
Route.get('/approval', approval);
Route.post('/signup', authentication, isMaster, signup);
Route.post('/signin', signin);
Route.post('/forgot', forgotPassword);
Route.post('/forgot/confirm', checkSecretCode, confirmSecretCode);
Route.post('/change', authentication, changePassword);

module.exports = Route;