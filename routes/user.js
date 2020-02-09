const Route = require('express').Router(),
  { UserController: { signin, signup, checkSignin, changePassword, updateImage, forgotPassword, confirmSecretCode, approval } } = require('../controllers'),
  { auth: { authentication, checkSecretCode, isMaster } } = require('../middlewares')

Route.post('/signin', signin);
Route.post('/forgot', forgotPassword);
Route.post('/forgot/confirm', checkSecretCode, confirmSecretCode);

Route.use( authentication );
Route.get('/', checkSignin);
Route.get('/approval', approval);
Route.post('/signup', isMaster, signup);
Route.post('/change', changePassword);
Route.post('/upload', updateImage);

module.exports = Route;